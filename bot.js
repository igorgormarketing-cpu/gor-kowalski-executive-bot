/**
 * ==========================================================================
 * GOR MARKETING - KOWALSKI EXECUTIVE WHATSAPP ASSISTANT (SURGICAL MASTER ENGINE 3.2)
 * ==========================================================================
 * STRICT OPERATING RULES (ZERO EXCEPTION):
 * 1. ZERO INTERVENTION: Kowalski NEVER replies unless explicitly summoned by name ("קובלסקי", "קאבלסקי", "קבלסקי").
 * 2. EXCEPTION: Inbound leads arriving via website links / ad campaigns (gormarketing.com, Google/Meta Ads).
 * 3. HUMAN TAKEOVER: The instant Igor messages a lead from his phone, Kowalski enters 100% silent standby.
 * 4. TAG FILTER: If someone tags another person (@someone) without Kowalski -> 100% silence.
 * 5. SINGLE-TURN EXECUTION: Delivers concise, sharp answer and immediately exits turn.
 */

const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const pino = require('pino');
const cron = require('node-cron');
const fs = require('fs');
const path = require('path');
const config = require('./config');
const kowalski = require('./kowalski_brain');
const mediaHandler = require('./tools/media_handler');
const persistentMemory = require('./tools/persistent_memory');
const proactiveTracker = require('./tools/proactive_tracker');
const twinWatcher = require('./tools/twin_project_b_watcher');
const commitmentTracker = require('./tools/commitment_tracker');

// Start Website Chatbot API & Lead Webhook Server (Zero-Penalty Gateway)
try {
  require('./server');
} catch (e) {
  console.log('[Server Launch Note]', e.message);
}

// Bounded state stores to prevent memory leaks
const botSentMessageIds = new Set();
const MAX_TRACKED_IDS = 1000;

const mutedChats = new Set();
const humanTakeoverChats = new Set();
const inboundLeadChats = new Set();
const activeChatLocks = new Set();
const groupSubjectCache = new Map();

async function getGroupSubject(sock, jid) {
  if (!jid || !jid.endsWith('@g.us')) return '';
  if (groupSubjectCache.has(jid)) return groupSubjectCache.get(jid);
  try {
    const meta = await sock.groupMetadata(jid);
    const subject = meta?.subject || '';
    groupSubjectCache.set(jid, subject);
    return subject;
  } catch (e) {
    return '';
  }
}

function isWhitelistedGroup(subject, jid) {
  const s = (subject || '').toLowerCase();
  const isGorMarketing = s.includes('gor marketing') || s.includes('גור מרקטינג');
  const isKowalskiGroup = s.includes('kowalsky') || s.includes('kowalski') || s.includes('קובלסקי') || s.includes('קבלסקי');
  const isKnownJid = jid === '120363422864506323@g.us';
  return isGorMarketing || isKowalskiGroup || isKnownJid;
}

function trackSentMessageId(id) {
  if (!id) return;
  if (botSentMessageIds.size > MAX_TRACKED_IDS) {
    const firstItem = botSentMessageIds.values().next().value;
    botSentMessageIds.delete(firstItem);
  }
  botSentMessageIds.add(id);
}

function extractMessageText(message) {
  if (!message) return '';
  let m = message;
  if (m.ephemeralMessage) m = m.ephemeralMessage.message;
  if (m.viewOnceMessage) m = m.viewOnceMessage.message;
  if (m.viewOnceMessageV2) m = m.viewOnceMessageV2.message;
  if (m.documentWithCaptionMessage) m = m.documentWithCaptionMessage.message;

  return m?.conversation ||
         m?.extendedTextMessage?.text ||
         m?.imageMessage?.caption ||
         m?.documentMessage?.caption ||
         m?.videoMessage?.caption ||
         '';
}

function isKowalskiMentioned(text) {
  if (!text) return false;
  const lower = text.trim().toLowerCase();

  // Check if any Kowalski name variant exists
  const hasName = config.NAME_VARIANTS.some(variant => lower.includes(variant.toLowerCase()));
  if (!hasName) return false;

  // Filter out passive 3rd-person mentions where people talk ABOUT Kowalski to each other
  // e.g. "על קובלסקי", "לגבי קובלסקי", "דיברתי עם קובלסקי", "זה של קובלסקי", "קובלסקי אמר"
  const isPassiveMention = /(?:(?:על|לגבי|בנוגע\s+ל|דיברתי\s+עם|שוחחתי\s+עם|שאלתי\s+את|אמרתי\s+ל|סיפרתי\s+על|שלחתי\s+ל|זה\s+של|הפרויקט\s+של|הקוד\s+של|הבוט\s+של)\s+(?:קובלסקי|קאבלסקי|קבלסקי|כוולסקי)|(?:קובלסקי|קאבלסקי|קבלסקי|כוולסקי)\s+(?:אמר|עשה|בדק|כתב|טען|הסביר|שלח|רץ))/i.test(lower);
  if (isPassiveMention) {
    console.log(`🔇 [3RD-PERSON PASSIVE MENTION] Kowalski mentioned in passing (${text}). Remaining silent.`);
    return false;
  }

  return true;
}

function isInboundLeadMessage(text) {
  if (!text) return false;
  const lower = text.toLowerCase();
  
  return lower.includes('הגעתי מסוכן gor') ||
         lower.includes('הגעתי מהאתר') ||
         lower.includes('הגעתי מקובלסקי') ||
         lower.includes('פניתי דרך בוט האתר') ||
         lower.includes('היי איגור, הגעתי') ||
         lower.includes('פנייה מאתר gor') ||
         lower.includes('הגעתי מהפרסום') ||
         lower.includes('הגעתי מהפייסבוק') ||
         lower.includes('הגעתי מגוגל') ||
         lower.includes('הגעתי מאינסטגרם') ||
         lower.includes('הגעתי מטיקטוק') ||
         lower.includes('שלום, אשמח לקבל פרטים') ||
         lower.includes('אשמח לפרטים על שירותי');
}

function isDismissCommand(text) {
  if (!text) return false;
  const t = text.trim().toLowerCase();
  
  if (['צא', 'שקט', 'שתוק', 'שחרר', 'משוחרר', 'תתנתק', 'התנתק', 'מיוט', 'כבה', 'כבה את עצמך', 'תכבה את עצמך', 'dismiss', 'отбой', 'свободен', 'стоп'].includes(t)) {
    return true;
  }
  
  return /(?:כבה\s+(?:את\s+)?עצמך|תכבה\s+(?:את\s+)?עצמך|צא\s+מהשיחה|תתנתק\s+מהשיחה|אל\s+תגיב|אל\s+תתערב|אל\s+תענה|תפסיק\s+להגיב|תפסיק\s+להתערב|שקט\s+קובלסקי|שתוק\s+קובלסקי|שחרר\s+קובלסקי|משוחרר\s+קובלסקי|תודה\s+קובלסקי|תודה\s+קבלסקי|תודה\s+כוולסקי)/i.test(t);
}

function isReactivateCommand(text) {
  if (!text) return false;
  const lower = text.toLowerCase();
  return lower.includes('חזור') || 
         lower.includes('תעזור לנו') || 
         lower.includes('אתה שוב איתנו') || 
         lower.includes('חזור לשיחה') || 
         lower.includes('вернись');
}

function isResetCommand(text) {
  if (!text) return false;
  const lower = text.toLowerCase();
  return lower.includes('אפס זיכרון') || 
         lower.includes('אפס שיחה') || 
         lower.includes('סשן חדש') || 
         lower.includes('נקה היסטוריה') || 
         lower.includes('נקה זיכרון');
}

let activeSocket = null;
let outboxProcessorStarted = false;
let cronJobsStarted = false;

function initOutboxProcessor(sock) {
  if (outboxProcessorStarted) return;
  outboxProcessorStarted = true;

  const outboxDir = path.join(__dirname, 'temp');
  if (!fs.existsSync(outboxDir)) fs.mkdirSync(outboxDir, { recursive: true });
  const outboxFile = path.join(outboxDir, 'outbox.json');

  setInterval(async () => {
    try {
      if (fs.existsSync(outboxFile)) {
        const data = fs.readFileSync(outboxFile, 'utf8');
        if (data && data.trim()) {
          const items = JSON.parse(data);
          fs.unlinkSync(outboxFile);
          for (const item of items) {
            if (item.to && item.text && activeSocket) {
              const sent = await activeSocket.sendMessage(item.to, { text: item.text });
              if (sent?.key?.id) trackSentMessageId(sent.key.id);
              if (item.to) inboundLeadChats.add(item.to);
              console.log(`📨 [Outbox Sent & Tracked as Lead] To: ${item.to}`);
            }
          }
        }
      }
    } catch (e) {
      console.error('[Outbox Processor Error]', e.message);
    }
  }, 1500);
}

function initCronJobs(sock) {
  if (cronJobsStarted) return;
  cronJobsStarted = true;

  // Morning Briefing Cron (Directly to Igor's self-chat only)
  cron.schedule(config.MORNING_BRIEF_CRON, async () => {
    try {
      if (!activeSocket) return;
      console.log('[Cron] Sending Morning Briefing to Igor...');
      const brief = proactiveTracker.generateMorningBriefing();
      const ownerJid = config.FOUNDER_PHONE + '@s.whatsapp.net';
      const sent = await activeSocket.sendMessage(ownerJid, { text: brief });
      if (sent?.key?.id) trackSentMessageId(sent.key.id);
    } catch (e) {
      console.error('[Cron Error]', e);
    }
  });

  // Commitment Tracker Cron (Directly to Igor's self-chat only)
  cron.schedule('*/30 9-21 * * *', async () => {
    try {
      if (!activeSocket) return;
      const pending = commitmentTracker.getPendingCommitments().filter(c => !c.notified);
      if (pending.length > 0) {
        const ownerJid = config.FOUNDER_PHONE + '@s.whatsapp.net';
        const msg = `📌 *תזכורת התחייבויות קובלסקי:* ישנן ${pending.length} התחייבויות פתוחות שנרשמו בשיחות. רשום "מעקב התחייבויות" לצפייה וטיפול. 🚀`;
        const sent = await activeSocket.sendMessage(ownerJid, { text: msg });
        if (sent?.key?.id) trackSentMessageId(sent.key.id);
        pending.forEach(p => p.notified = true);
        commitmentTracker.saveData();
      }
    } catch (e) {
      console.error('[Commitment Cron Error]', e.message);
    }
  });
}

async function startKowalski() {
  console.log('====================================================');
  console.log('🐧 מפעיל את קובלסקי 3.2 (SURGICAL ZERO-INTERVENTION ENGINE)');
  console.log('====================================================');

  const { state, saveCreds } = await useMultiFileAuthState(config.PATHS.AUTH_DIR);

  const sock = makeWASocket({
    auth: state,
    logger: pino({ level: 'silent' }),
    printQRInTerminal: false,
    browser: ['Ubuntu', 'Chrome', '20.0.04']
  });

  activeSocket = sock;
  initOutboxProcessor(sock);
  initCronJobs(sock);

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === 'close') {
      const shouldReconnect = (lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log('Connection closed, reconnecting...', shouldReconnect);
      if (shouldReconnect) {
        setTimeout(() => startKowalski(), 3000);
      }
    } else if (connection === 'open') {
      console.log('\n====================================================');
      console.log('✅ קובלסקי 3.2 מחובר בהצלחה לוואטסאפ (משמעת ברזל פעילה)!');
      console.log(`👤 User ID: ${sock.user?.id || 'Connected'}`);
      console.log('====================================================\n');
      
      try {
        twinWatcher.init(sock);
      } catch (err) {
        console.error('[TWIN Watcher Launch Warning]', err.message);
      }
    }
  });

  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return;

    for (const msg of messages) {
      if (!msg.message) continue;
      const remoteJid = msg.key.remoteJid;
      if (!remoteJid || remoteJid.includes('@newsletter') || remoteJid.includes('@broadcast') || remoteJid.includes('@status')) {
        continue;
      }

      // Ignore messages sent by this bot instance
      if (botSentMessageIds.has(msg.key.id)) continue;

      const isGroup = remoteJid.endsWith('@g.us');
      const senderPhone = (msg.key.participant || remoteJid).split('@')[0].split(':')[0];
      const isSentByIgor = (senderPhone === config.FOUNDER_PHONE) || (msg.key.fromMe === true);
      const isSelfChat = remoteJid.includes(config.FOUNDER_PHONE) || remoteJid.startsWith('120363422864506323');
      const isAudio = Boolean(msg.message?.audioMessage);
      const isImage = Boolean(msg.message?.imageMessage || (msg.message?.documentMessage?.mimetype?.startsWith('image/')));
      const text = extractMessageText(msg.message);

      // 1. Silent Background Recording & Linguistic Twin Training
      const senderLabel = isSentByIgor ? 'איגור' : (isGroup ? `משתתף (${senderPhone})` : 'איש קשר');
      if (text) {
        kowalski.recordBackgroundMessage(remoteJid, senderLabel, text);
      }

      // 2. Human Takeover Tracking (Igor chatting in non-self chat -> Kowalski stays 100% silent)
      if (isSentByIgor && !isSelfChat) {
        humanTakeoverChats.add(remoteJid);
      }

      // 3. Name Mention Check (Did someone say "קובלסקי", "קאבלסקי", "קבלסקי"?)
      const mentionsKowalski = isKowalskiMentioned(text);

      // 4. Inbound Marketing Link Detection (Website, Campaigns, Deep Links)
      const isLeadFromLink = isInboundLeadMessage(text);
      if (isLeadFromLink) {
        inboundLeadChats.add(remoteJid);
        console.log(`🎯 [INBOUND CAMPAIGN LEAD] Chat ${remoteJid} arrived from marketing link.`);
      }

      const isOngoingLeadChat = inboundLeadChats.has(remoteJid);
      const isUnderHumanTakeover = humanTakeoverChats.has(remoteJid);

      // 5. UNIVERSAL ON-DEMAND GATEKEEPER:
      // In any conversation (groups, 1-on-1s, client chats), Kowalski ONLY triggers if:
      // A. Self-Chat (Igor's direct personal notes/chat)
      // B. Explicitly addressed by name ("קובלסקי, [שאלה / בקשה]")
      // C. Audio note (evaluated silently; only replies if Kowalski is named in the audio)
      // D. Inbound Campaign Lead (not taken over by human yet)
      const shouldTrigger = isSelfChat || mentionsKowalski || isAudio || (isOngoingLeadChat && !isUnderHumanTakeover && !isSentByIgor);

      if (!shouldTrigger) {
        // 100% Silent Standby: Zero reply, zero presence, zero interruption!
        continue;
      }

      // Tagging someone else rule (@someone and NOT Kowalski) -> Stay 100% silent!
      const tagsSomeoneElse = text.includes('@') && !mentionsKowalski;
      if (tagsSomeoneElse && !isSelfChat) {
        continue;
      }

      // 6. Dismiss / Mute Command (Standby Mode)
      if (isDismissCommand(text)) {
        mutedChats.add(remoteJid);
        console.log(`🔒 [DISMISSED/STANDBY] Chat ${remoteJid} is now on Silent Standby mode.`);
        const dismissReply = await sock.sendMessage(remoteJid, {
          text: '🫡 *קיבלתי, כובה מהשיחה. אפשר לקרוא לי שוב בשמי.*'
        }, { quoted: msg });
        if (dismissReply?.key?.id) trackSentMessageId(dismissReply.key.id);
        continue;
      }

      // 7. Memory Reset Command
      if (mentionsKowalski && isResetCommand(text) && isSentByIgor) {
        kowalski.clearChatHistory(remoteJid);
        const resetReply = await sock.sendMessage(remoteJid, {
          text: '🧹 *הזיכרון אופס בהצלחה! פתחנו סשן חדש ונקי. במה אוכל לעזור לכם כרגע?*'
        }, { quoted: msg });
        if (resetReply?.key?.id) trackSentMessageId(resetReply.key.id);
        continue;
      }

      // 8. Dynamic Skill Learning Command
      if (mentionsKowalski && text.includes('תרשום לך בסקילס') && isSentByIgor) {
        const skillText = text.replace(/.*תרשום לך בסקילס[:,\s]*/i, '').trim();
        const skillKey = `custom_skill_${Date.now()}`;
        persistentMemory.addSkill(skillKey, { rule: skillText, addedAt: new Date().toISOString() });
        const skillReply = await sock.sendMessage(remoteJid, {
          text: `🫡 *קיבלתי איגור! רשמתי ושמרתי בסקילס שלי:*\n"${skillText}"\n\nאני מיישם את זה מעכשיו באופן אוטומטי!`
        }, { quoted: msg });
        if (skillReply?.key?.id) trackSentMessageId(skillReply.key.id);
        continue;
      }

      // 9. Check Muted / Standby State
      if (mutedChats.has(remoteJid)) {
        if (isSentByIgor && (mentionsKowalski || isReactivateCommand(text))) {
          mutedChats.delete(remoteJid);
          console.log(`🔓 [UNMUTED] Chat ${remoteJid} reactivated by Igor.`);
        } else {
          continue;
        }
      }

      // Concurrency Lock per Chat
      if (activeChatLocks.has(remoteJid)) {
        continue;
      }
      activeChatLocks.add(remoteJid);

      console.log(`\n📨 [AUTHORIZED TRIGGER] Chat: ${remoteJid} (isGroup: ${isGroup}) | isSelf: ${isSelfChat} | Audio: ${isAudio} | Image: ${isImage} | Text: "${text}"`);

      // 11. Presence Update Simulation ("מקליד/ה..." / "מקליט קטע קול...") - Only for verified active triggers!
      const presenceType = isAudio ? 'recording' : 'composing';
      let typingInterval = null;
      if (isSelfChat || mentionsKowalski || isOngoingLeadChat) {
        try { await sock.sendPresenceUpdate(presenceType, remoteJid); } catch (e) {}
        typingInterval = setInterval(async () => {
          try { await sock.sendPresenceUpdate(presenceType, remoteJid); } catch (e) {}
        }, 2500);
      }

      try {
        let response = null;

        // A. AUDIO MESSAGE HANDLER (Voice Note Master)
        if (isAudio) {
          const audioBuffer = await mediaHandler.downloadMedia(msg);
          if (audioBuffer) {
            const mimeType = mediaHandler.getMimeType(msg.message) || 'audio/ogg; codecs=opus';
            response = await kowalski.processVoiceNote(remoteJid, audioBuffer, mimeType, isSentByIgor, isGroup, isSelfChat);
          }
        }
        // B. IMAGE / OCR HANDLER (Multimodal Vision)
        else if (isImage) {
          if (isSelfChat || mentionsKowalski) {
            try { await sock.sendPresenceUpdate('composing', remoteJid); } catch(e) {}
          }
          const imageBuffer = await mediaHandler.downloadMedia(msg);
          if (imageBuffer) {
            const mimeType = mediaHandler.getMimeType(msg.message);
            response = await kowalski.processImage(remoteJid, imageBuffer, mimeType, text, isSentByIgor);
          }
        }
        // C. STANDARD TEXT HANDLER
        else {
          if (isSelfChat || mentionsKowalski) {
            try { await sock.sendPresenceUpdate('composing', remoteJid); } catch(e) {}
          }
          response = await kowalski.processMessage(remoteJid, text, isSentByIgor);
        }

        if (typingInterval) clearInterval(typingInterval);
        try { await sock.sendPresenceUpdate('paused', remoteJid); } catch(e) {}

        if (response && response.text) {
          console.log(`⚡ [INSTANT TURBO REPLY] To ${remoteJid}...`);
          const sent = await sock.sendMessage(remoteJid, { text: response.text }, { quoted: msg });
          if (sent?.key?.id) trackSentMessageId(sent.key.id);

          // Handle multiple file & audio attachments (.pdf, .docx, .ics, .mp3 voice notes)
          const attachments = response.fileAttachments || [];
          
          for (const att of attachments) {
            if (att.buffer) {
              console.log(`🎙️ [AUDIO] Sending audio attachment to ${remoteJid}...`);
              const audioSent = await sock.sendMessage(remoteJid, {
                audio: att.buffer,
                mimetype: att.mimetype || 'audio/mpeg'
              }, { quoted: msg });
              if (audioSent?.key?.id) trackSentMessageId(audioSent.key.id);
            } else if (att.path && fs.existsSync(att.path)) {
              if (att.mimetype && att.mimetype.startsWith('audio')) {
                console.log(`🎙️ [AUDIO] Sending audio file to ${remoteJid}...`);
                const audioSent = await sock.sendMessage(remoteJid, {
                  audio: { url: att.path },
                  mimetype: att.mimetype || 'audio/mpeg'
                }, { quoted: msg });
                if (audioSent?.key?.id) trackSentMessageId(audioSent.key.id);
              } else {
                console.log(`📎 [DOCUMENT] Sending ${att.filename} to ${remoteJid}...`);
                const docSent = await sock.sendMessage(remoteJid, {
                  document: { url: att.path },
                  mimetype: att.mimetype,
                  fileName: att.filename
                }, { quoted: msg });
                if (docSent?.key?.id) trackSentMessageId(docSent.key.id);
              }
            }
          }
        }
      } catch (err) {
        clearInterval(typingInterval);
        try { await sock.sendPresenceUpdate('paused', remoteJid); } catch(e) {}
        console.error('[Kowalski Bot Error]', err);
      } finally {
        activeChatLocks.delete(remoteJid);
      }
    }
  });
}

startKowalski();
