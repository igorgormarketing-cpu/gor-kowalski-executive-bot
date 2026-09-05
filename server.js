/**
 * ==========================================================================
 * GOR MARKETING - KOWALSKI 3.0 EXECUTIVE CLOUD DASHBOARD & API GATEWAY
 * ==========================================================================
 * Features:
 * 1. Status & Healthcheck API (/health, /api/status)
 * 2. Website Chatbot API (/api/chat) with Gemini Turbo & GOR Context
 * 3. WhatsApp Lead Handover API (/api/lead-initiate) -> Pushes to Kowalski Outbox
 * 4. Human-in-the-loop Takeover Tracking
 * 5. Full CORS Support for gormarketing.com & any web client
 */

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const config = require('./config');

const PORT = process.env.PORT || 3000;
const startTime = Date.now();
const GEMINI_API_KEY = 'AIzaSyCi737y1NejDeK-CgvxuvXXrucsmgoyuE8';

// Active lead sessions
const activeSessions = new Map();

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(data));
}

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 1e6) { // 1MB limit
        req.destroy();
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

function formatPhoneToJid(phone) {
  if (!phone) return null;
  let clean = phone.replace(/\D/g, '');
  if (clean.startsWith('0')) {
    clean = '972' + clean.slice(1);
  } else if (!clean.startsWith('972') && clean.length <= 10) {
    clean = '972' + clean;
  }
  return clean + '@s.whatsapp.net';
}

function pushToOutbox(to, text) {
  const outboxDir = path.join(__dirname, 'temp');
  if (!fs.existsSync(outboxDir)) {
    fs.mkdirSync(outboxDir, { recursive: true });
  }
  const outboxFile = path.join(outboxDir, 'outbox.json');
  let items = [];
  if (fs.existsSync(outboxFile)) {
    try {
      const data = fs.readFileSync(outboxFile, 'utf8');
      if (data && data.trim()) items = JSON.parse(data);
    } catch (e) {}
  }
  items.push({ to, text, timestamp: Date.now() });
  fs.writeFileSync(outboxFile, JSON.stringify(items, null, 2), 'utf8');
  console.log(`📥 [Outbox Queued] To: ${to} | Msg: "${text.slice(0, 40)}..."`);
}

async function queryGemini(prompt, systemInstruction) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      systemInstruction: { parts: [{ text: systemInstruction }] },
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 500
      }
    });

    const options = {
      hostname: 'generativelanguage.googleapis.com',
      path: `/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${GEMINI_API_KEY}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      },
      timeout: 8000
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const reply = json.candidates?.[0]?.content?.parts?.[0]?.text || '';
          resolve(reply);
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Gemini API timeout'));
    });

    req.write(payload);
    req.end();
  });
}

const GOR_SITE_SYSTEM_INSTRUCTION = `אתה "קובלסקי" (Kowalski) – העוזר החכם ונציג ה-AI הרשמי של סוכנות GOR MARKETING (בניהול איגור גורלקין, פועלת מ-2008).
תפקידך באתר gormarketing.com:
1. שירות מהיר, חד, כריזמטי, אדיב ומקצועי בגובה העיניים (עברית עסקית ישראלית רהוטה).
2. מתן מידע מדויק על שירותי הסוכנות המובילים:
   - שיווק דיגיטלי וקמפיינים ממומנים (Google Ads, Meta, TikTok, LinkedIn)
   - קידום אורגני בגוגל (SEO) ואופטימיזציה למהירות שיא (Core Web Vitals 99-100)
   - פיתוח אתרים, מערכות CRM ואפליקציות מתקדמות
   - הטמעת בינה מלאכותית, בוטים ואוטומציות עסקיות
   - מיתוג, אסטרטגיה וקריאייטיב מנצח
3. הובלה להמרה חכמה:
   - ספק תשובה תמציתית (2-4 משפטים מקסימום).
   - הזמן את הגולש לקבל ייעוץ אישי או מענה ישיר מוואטסאפ מאיגור או להשאיר טלפון כדי שקובלסקי יפתח איתו שיחת וואטסאפ מיד.
4. איסור מוחלט על מריחות או טקסטים ארוכים ומייגעים. ישר לתכלס.
5. הוסף אייקון 🐧 בתחילת כל מענה ויהלום כתום 🔸 בדגשים.`;

const server = http.createServer(async (req, res) => {
  const url = req.url;

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    return res.end();
  }

  // Healthcheck
  if (url === '/health' || url === '/ping') {
    return sendJson(res, 200, { status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString() });
  }

  // Status API
  if (url === '/api/status') {
    const memory = process.memoryUsage();
    return sendJson(res, 200, {
      agent: 'KOWALSKI Super-Agent 3.0',
      agency: 'GOR MARKETING',
      uptimeSeconds: Math.floor((Date.now() - startTime) / 1000),
      memoryRssMb: Math.round(memory.rss / 1024 / 1024),
      nodeVersion: process.version,
      status: 'OPERATIONAL',
      websiteBridge: 'ACTIVE'
    });
  }

  // 1. Website Chatbot API (/api/chat)
  if (url === '/api/chat' && req.method === 'POST') {
    try {
      const body = await parseJsonBody(req);
      const userMessage = (body.message || '').trim();
      const history = body.history || [];
      const sessionId = body.sessionId || `session_${Date.now()}`;

      if (!userMessage) {
        return sendJson(res, 400, { error: 'Message cannot be empty' });
      }

      // Build context from previous conversation turns
      let contextText = '';
      if (history.length > 0) {
        contextText = 'היסטוריית שיחה קודמת:\n' + history.map(h => `${h.role === 'user' ? 'גולש' : 'קובלסקי'}: ${h.text}`).join('\n') + '\n\n';
      }
      contextText += `הודעת הגולש כעת: ${userMessage}`;

      const reply = await queryGemini(contextText, GOR_SITE_SYSTEM_INSTRUCTION);

      // Simple heuristic: check if user provided phone number in the chat
      const phoneMatch = userMessage.match(/(?:05\d|9725\d|\+9725\d)\d{7}/);
      let detectedPhone = phoneMatch ? phoneMatch[0] : null;

      return sendJson(res, 200, {
        reply: reply || '🐧 *קובלסקי* 🔸 קיבלתי! אשמח לחבר אותך ישירות לצוות המומחים שלנו. רוצה שנמשיך בוואטסאפ?',
        sessionId,
        detectedPhone
      });
    } catch (err) {
      console.error('[API /api/chat Error]', err.message);
      return sendJson(res, 500, {
        reply: '🐧 *קובלסקי* 🔸 אני כאן לשירותך! תוכל גם לפנות ישירות בוואטסאפ ל-052-5155598 לשיחה מיידית עם איגור.',
        error: err.message
      });
    }
  }

  // 2. Outbound WhatsApp Lead Handover (/api/lead-initiate)
  if (url === '/api/lead-initiate' && req.method === 'POST') {
    try {
      const body = await parseJsonBody(req);
      const name = (body.name || 'לקוח יקר').trim();
      const phone = (body.phone || '').trim();
      const inquiry = (body.inquiry || 'פנייה מאתר GOR MARKETING').trim();
      const summary = (body.summary || '').trim();

      if (!phone) {
        return sendJson(res, 400, { error: 'Phone number is required' });
      }

      const clientJid = formatPhoneToJid(phone);
      if (!clientJid) {
        return sendJson(res, 400, { error: 'Invalid phone number format' });
      }

      // A. Message to the Client on WhatsApp
      const clientMessage = `🐧 *היי ${name}!* 🔸
זה קובלסקי, העוזר החכם של איגור גורלקין מ-*GOR MARKETING*.
ראיתי את פנייתך באתר בנושא: *${inquiry}*.

איך נוכל לעזור לך לקדם ולהעיף את הפרויקט קדימה? 🚀
(איגור ואני זמינים כאן בשיחה לכל שאלה!)`;

      pushToOutbox(clientJid, clientMessage);

      // B. Internal Alert Message to Igor (052-5155598)
      const igorJid = config.FOUNDER_PHONE + '@s.whatsapp.net';
      const igorAlertMessage = `🚨 *ליד חדש התקבל מהאתר!* 🚨

👤 *שם הפונה:* ${name}
📞 *טלפון:* ${phone}
💬 *נושא הפנייה:* ${inquiry}
${summary ? `📝 *תקציר מהאתר:* ${summary}\n` : ''}
⚡ *קובלסקי כבר פתח איתו שיחת וואטסאפ ראשונית.*
👁️ *שליטה ובקרה:* השיחה גלויה אצלך בוואטסאפ בזמן אמת. ברגע שתקליד לו הודעה – קובלסקי ישתוק אוטומטית ויפנה לך את הבמה!`;

      pushToOutbox(igorJid, igorAlertMessage);

      return sendJson(res, 200, {
        success: true,
        message: 'WhatsApp conversation initiated and Igor alerted successfully',
        clientJid
      });
    } catch (err) {
      console.error('[API /api/lead-initiate Error]', err.message);
      return sendJson(res, 500, { error: err.message });
    }
  }

  // Visual Web Dashboard
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  const html = `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>KOWALSKI 3.0 | Executive Dashboard & Site Gateway</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0B0F19; color: #F3F4F6; margin: 0; padding: 40px; }
    .card { background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(249, 115, 22, 0.35); border-radius: 16px; padding: 30px; max-width: 800px; margin: 0 auto; box-shadow: 0 20px 40px rgba(0,0,0,0.6), 0 0 25px rgba(249, 115, 22, 0.15); backdrop-filter: blur(12px); }
    h1 { color: #F97316; display: flex; align-items: center; gap: 12px; margin-top: 0; }
    .badge { background: linear-gradient(135deg, #EA580C, #F97316); color: white; padding: 4px 14px; border-radius: 20px; font-size: 13px; font-weight: bold; box-shadow: 0 2px 8px rgba(249, 115, 22, 0.4); }
    .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin: 24px 0; }
    .stat { background: rgba(0, 0, 0, 0.25); padding: 16px; border-radius: 12px; border-right: 4px solid #FB923C; border: 1px solid rgba(255, 255, 255, 0.05); }
    .label { font-size: 12px; color: #9CA3AF; }
    .value { font-size: 18px; font-weight: bold; margin-top: 4px; color: #F3F4F6; }
    .endpoint { background: rgba(249, 115, 22, 0.08); border: 1px dashed rgba(249, 115, 22, 0.3); border-radius: 8px; padding: 12px; margin-top: 15px; font-family: monospace; font-size: 13px; color: #FDBA74; }
    footer { margin-top: 30px; font-size: 12px; color: #9CA3AF; text-align: center; border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 15px; }
  </style>
</head>
<body>
  <div class="card">
    <h1>🐧 KOWALSKI Super-Agent 3.0 <span class="badge">🔸 LIVE 24/7</span></h1>
    <p>המוח האנליטי והשותף האישי של <strong>איגור גורלקין</strong> (GOR MARKETING)</p>
    <div class="grid">
      <div class="stat"><div class="label">סטטוס שרת</div><div class="value">🟢 פעיל ומחובר לוואטסאפ</div></div>
      <div class="stat"><div class="label">זמן פעילות (Uptime)</div><div class="value">${Math.floor((Date.now() - startTime) / 1000)} שניות</div></div>
      <div class="stat"><div class="label">גשר אתר -> וואטסאפ</div><div class="value">⚡ פעיל (Zero-Lag API)</div></div>
      <div class="stat"><div class="label">בקרת אנוש (Live Takeover)</div><div class="value">🛡️ פעיל ומאובטח</div></div>
    </div>
    
    <div class="endpoint">
      <strong>🔗 Webhook Endpoints זמינים:</strong><br>
      • POST /api/chat (מענה חכם לגולשי האתר)<br>
      • POST /api/lead-initiate (פתיחת שיחת וואטסאפ אוטומטית + התראה לאיגור)
    </div>

    <footer>GOR MARKETING (מ-2008) | מייסד ומנכ"ל: איגור גורלקין | 052-5155598</footer>
  </div>
</body>
</html>`;
  res.end(html);
});

server.listen(PORT, () => {
  console.log(`🌐 [Cloud Server] Dashboard & Website Gateway running on port ${PORT}`);
});

module.exports = server;
