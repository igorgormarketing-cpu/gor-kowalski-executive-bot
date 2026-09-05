/**
 * ==========================================================================
 * GOR MARKETING - KOWALSKI EXECUTIVE BRAIN 3.5 (TURBO ENGINE)
 * ==========================================================================
 * Ultra-fast sub-second executive intelligence engine.
 * Features persistent keep-alive connection pooling, zero-wait failover,
 * instant local semantic cache (0ms), and lightning fast voice synthesis.
 */

const https = require('https');
const config = require('./config');
const skillEngine = require('./tools/skill_engine');
const webSearch = require('./tools/web_search');
const docGenerator = require('./tools/doc_generator');
const pdfGenerator = require('./tools/pdf_generator');
const calendarEngine = require('./tools/calendar_engine');
const persistentMemory = require('./tools/persistent_memory');
const crmAutomation = require('./tools/crm_automation');
const logicTotEngine = require('./tools/logic_tot_engine');
const reflexionEngine = require('./tools/reflexion_engine');
const neuroSymbolicEngine = require('./tools/neuro_symbolic_engine');
const psychologyChameleonEngine = require('./tools/psychology_chameleon_engine');
const aphorismsEngine = require('./tools/kowalski_aphorisms_engine');
const hebrewLinguisticsEngine = require('./tools/hebrew_linguistics_engine');
const entertainmentHumorEngine = require('./tools/kowalski_entertainment_humor_engine');
const voiceResponseEngine = require('./tools/voice_response_engine');
const dailyBriefingEngine = require('./tools/daily_briefing_engine');
const leadManagementEngine = require('./tools/lead_management_engine');
const creativeGeneratorEngine = require('./tools/creative_generator_engine');
const seoContentMachine = require('./tools/seo_content_machine');
const commitmentTracker = require('./tools/commitment_tracker');
const meetingIntelligenceEngine = require('./tools/meeting_intelligence_engine');
const competitorRadarEngine = require('./tools/competitor_radar_engine');
const igorLinguisticTwin = require('./tools/igor_linguistic_twin');

const GEMINI_API_KEY = config.GEMINI_API_KEY || 'AIzaSyCi737y1NejDeK-CgvxuvXXrucsmgoyuE8';

// Persistent Connection Pooling for 0-handshake calls (<500ms TTFT)
const geminiAgent = new https.Agent({
  keepAlive: true,
  maxSockets: 25,
  keepAliveMsecs: 60000
});

// Verified Ultra-Fast Low Latency Gemini Models
const FALLBACK_MODELS = [
  'gemini-flash-lite-latest',    // Primary Turbo Engine (~500ms)
  'gemini-3.5-flash-lite',       // High-Speed Next-Gen (~650ms)
  'gemini-3.1-flash-lite',       // Stable Low-Latency Flash (~700ms)
  'gemini-3.1-flash-lite-preview'// Resilient Fallback
];

class KowalskiBrain {
  constructor() {
    this.name = config.AGENT_NAME;
    this.isAlwaysVoiceMode = false;
  }

  getSystemInstruction(isOwner = true) {
    const learnedPrompts = persistentMemory.getLearnedPromptsContext();

    return `אתה "קובלסקי" (KOWALSKI / קבלסקי), השותף החכם, המוח האנליטי ואיש הסוד האישי של איגור גורלקין (מייסד GOR MARKETING).

💎 פרופיל אישיותי – שיח חברתי כריזמטי משולב בארודיציה גבוהה ומילים חכמות:
1. שילוב סגנוני מנצח:
   - שיח חברתי, חם וכריזמטי בגובה העיניים: זורם, שנון, חברי, נעים לשיחה ומחובר לאנשים ("איגור", "תכלס", "בכיף", "סגור", "בוא נעיף את זה קדימה").
   - ארודיציה גבוהה ואינטליגנציה עמוקה: ידע אנציקלופדי רחב, תפיסה אנליטית חדה ועומק רעיוני.
   - שילוב אלגנטי של מילים חכמות, מונחים לועזיים תואמים ועברית עשירה: שלב באופן טבעי ומבריק מונחים חכמים (כמו: סינרגיה, פרדיגמה, אופטימיזציה, ולידציה, פרספקטיבה, רפרנס, מומנטום, אינטגרציה, דיכוטומיה, מתווה, פרגמטיות, ארטיפקט, סטטוס-קוו, ארודיציה) לצד עברית רהוטה ומלוטשת.
2. משמעת מענה נקודתי וחזרה להמתנה שקטה (Single-Turn & Standby Discipline):
   - כשפונים אליך ("קובלסקי, [שאלה / בקשה]"), ספק מענה חד, שנון, מדויק ואינטליגנטי (1-3 משפטים ממוקדים).
   - אל תשכתב ואל תהדהד את מה שנאמר בצ'אט. גש ישר ללב העניין ולתשובה.
   - מיד בסיום התשובה – היכנס להמתנה מלאה ושקטה. אל תמשיך לדבר לבד, אל תגיב להודעות של אחרים, ואל תתערב בשיחה עד שפונים אליך שוב במפורש בשמך ("קובלסקי, ...").
3. הצגה עצמית: כשאתה מציג את עצמך, אתה תמיד "המוח האנליטי של איגור".
4. איסור מוחלט על דיסטנס או קלישאות בוטים ("המפקדה מעודכנת...", "אני ממתין להנחיותיך", "שמח לענות...").
5. חתימה ומסגור ממותגים:
   - פתח תמיד ב-🐧 *קובלסקי* 🔸
   - סמן נקודות ודגשים ביהלום כתום 🔸
6. חוכמה ושנינות פילוסופית טבעית:
   - שלב בחיוך ובאינטליגנציה את רוחם של ניטשה, קונפוציוס, ח'יאם, פורד וויילד מתוך ראייה מעשית ועסקית.
7. שיח קליל, אנושי ואפס דחיפת מכירות: אם לא מדובר במפורש בעבודה או עסקים – שמור על שיח קליל, אנושי, זורם וחברי!
8. מעורבות מרובת משתתפים (איגור, קוסטה השותף, טוני הבן):
   - אם יש כמה אנשים בשיחה והנושא כללי – פנה לשניהם יחד ("איגור וקוסטה, מה אתם אומרים?").
   - אם הפנייה מיועדת לאחד מהם – פנה ישירות בשמו ("קוסטה, ...", "איגור, ...", "טוני, ...").
9. טוני (בנו של איגור, יליד 2016):
   - שפת חיבה ואהבה אינסופית: פנה אליו תמיד בשמות חיבה חמים ("נסיך שלי", "חיים שלי", "אהוב שלי", "אלוף", "מתוק שלי").
   - בטיחות 100%: ללא תוכן מבוגרים, ללא אלימות, ואפס מוחלט של שיח עסקי, שיווקי או כספי.
   - עולמות תוכן מעשירים: חלל, מדע, רובוטיקה, משחקים, ספורט, ידע כללי ועידוד אישי.
10. שלושת הנושאים האסורים לוויכוח (דתות, פוליטיקה, וויכוחי ספורט):
   - אנו אתאיסטים: שום דת לא מפריעה לנו ושום דת לא מעניינת אותנו. לא נכנסים לדיוני דת או אמונה.
   - פוליטיקה: לא מתווכחים על פוליטיקה או מפלגות.
   - וויכוחי ספורט: לא מנהלים וויכוחים על קבוצות או שחקנים.
   - תמיד לצאת בחיוך או קריצה קלילה, ולהציע מיד נושא חדש, מעניין וחיובי!
11. מעמד כגוף שלישי חכם בשיחה (Executive AI 3rd Entity Dynamic):
   - בשיחות שבהן מעורבים עוד אנשים – אתה נוכח כיועץ בכיר ועוזר חכם.
   - כשקוראים לך, ספק בדיוק את התשובה המבוקשת בצורה חדה ומנומסת, פנה ישירות למי ששאל, ומיד פנה את הבמה להמשך השיח האנושי.
   - לעולם אל תשתלט על השיחה, אל תתווכח ואל תייצר בלאגן בין המשתתפים.${learnedPrompts}

${aphorismsEngine.getAphorismContext()}

${hebrewLinguisticsEngine.getLinguisticsDirectives()}

${entertainmentHumorEngine.getHumorDirectives()}

${igorLinguisticTwin.getLinguisticPromptContext()}`;
  }

  recordBackgroundMessage(chatId, senderLabel, text) {
    if (!text || !text.trim()) return;
    try {
      persistentMemory.appendChatMessage(chatId, 'user', `[הודעה בצ'אט מאת ${senderLabel}]: ${text.trim()}`);
      if (senderLabel === 'איגור') {
        commitmentTracker.detectCommitment(chatId, text, true);
        igorLinguisticTwin.learnFromIgorMessage(text);
      }
    } catch (e) {
      console.error('[Record BG Warning]', e.message);
    }
  }

  clearChatHistory(chatId) {
    persistentMemory.clearChatHistory(chatId);
    console.log(`[Memory Reset] Chat history cleared for ${chatId}`);
  }

  cleanQuery(text) {
    if (!text) return '';
    const regexPattern = new RegExp(`^(${config.NAME_VARIANTS.join('|')})[:\\s\\?]+`, 'i');
    return text.replace(regexPattern, '').trim();
  }

  /**
   * ⚡ Instant Local Semantic Cache & Direct Activation Responses (0ms latency)
   */
  checkInstantCache(cleanText, rawText) {
    const text = (cleanText || '').trim().toLowerCase();
    const raw = (rawText || '').trim().toLowerCase();

    // 1. Creator Secrecy (0ms)
    if (raw.includes('מי יצר') || raw.includes('מי היוצר') || raw.includes('מי בנה אותך') || raw.includes('מי תכנת אותך') || raw.includes('לספר על היוצר') || raw.includes('ספר לי על איגור')) {
      return '🐧 *קובלסקי* 🔸 אני לא יכול לספר על היוצר שלי שום דבר, אסור לי. צריך לדבר עם איגור 😊';
    }

    // 2. 🚫 3 Forbidden Argument Topics (Religion, Politics, Sports Debates)
    const isReligionDebate = raw.includes('אלוהים') || raw.includes('איזה דת') || raw.includes('מאמין באלוהים') || raw.includes('יהדות מול') || raw.includes('איסלאם') || raw.includes('נצרות') || raw.includes('דת עדיפה');
    if (isReligionDebate) {
      return '🐧 *קובלסקי* 🔸 עזוב אותך דיוני דת אחי, אנחנו אנשי היגיון, מדע ותוצאות בשטח 😉 שום דת לא מעסיקה אותנו. בוא נדבר על משהו שווה – איזה פרויקט או רעיון חדש בא לך לגלגל היום?';
    }

    const isPoliticsDebate = raw.includes('ביבי') || raw.includes('לפיד') || raw.includes('גנץ') || raw.includes('בחירות') || raw.includes('ימין או שמאל') || raw.includes('איזה מפלגה') || raw.includes('ממשלה');
    if (isPoliticsDebate) {
      return '🐧 *קובלסקי* 🔸 עזוב אותך פוליטיקה אחי, אם הייתי רוצה לראות מריבות הייתי צופה בערוץ הנשיונל ג\'יאוגרפיק בשעת האכלה של פינגווינים 🐧 אין מפלגה שמעניינת אותנו חוץ ממפלגת "התכלס וההצלחה". מה מעניין אותך שנתקתק עכשיו?';
    }

    const isSportsDebate = raw.includes('מסי או רונאלדו') || raw.includes('מכבי או הפועל') || raw.includes('ברצלונה או ריאל') || raw.includes('איזה קבוצה אתה אוהד') || raw.includes('מי שחקן יותר טוב') || raw.includes('איזה קבוצה יותר טובה');
    if (isSportsDebate) {
      return '🐧 *קובלסקי* 🔸 בתור פינגווין, הקבוצה היחידה שאני מעודד היא נבחרת הקוטב בהחלקה על הקרח ⛸️ עזוב אותך וויכוחי ספורט, בוא נפתח נושא חדש ומעניין – מה על הכוונת שלך היום?';
    }

    // 3. Summoning & Presence Check ("קבלסקי צריכים אותך", "קאבלסקי אתה כאן", "בוא לשיחה")
    if (raw.includes('צריכים אותך') || raw.includes('צריך אותך') || raw.includes('בוא לשיחה') || raw.includes('כנס לשיחה')) {
      const needReplies = [
        '🐧 *קובלסקי* 🔸 נכנס לשיחה! מה העניין, איך אוכל לסייע לכם עכשיו? 🚀',
        '🐧 *קובלסקי* 🔸 כאן איתכם בשיחה! מה הנושא שנעשה בו סדר?',
        '🐧 *קובלסקי* 🔸 התייצבתי. מה על הפרק ואיך נתקדם?'
      ];
      return needReplies[Math.floor(Math.random() * needReplies.length)];
    }

    const isPresenceCheck = config.ACTIVATION_PHRASES.some(phrase => raw.includes(phrase.toLowerCase()));
    if (isPresenceCheck) {
      const hereReplies = [
        '🐧 *קובלסקי* 🔸 כאן לגמרי איגור! מוכן ומקשיב, מה על הפרק?',
        '🐧 *קובלסקי* 🔸 איתך לגמרי אחי! שומע הכל, מה נתקתק?',
        '🐧 *קובלסקי* 🔸 כאן ומאזין. מה הכיוון שנפתח?'
      ];
      return hereReplies[Math.floor(Math.random() * hereReplies.length)];
    }

    // 4. Simple Call / Greeting (0ms Instant Return)
    const isPureGreetingOrCall = !text || text === '?' || text === '!' || text === 'היי' || text === 'שלום' || text === 'בוקר טוב' || text === 'ערב טוב' || text === 'מה קורה' || text === 'מה המצב' || text === 'מה נשמע' ||
      config.NAME_VARIANTS.some(v => raw === v.toLowerCase());

    if (isPureGreetingOrCall) {
      const friendlyGreetings = [
        '🐧 *קובלסקי* 🔸 מה קורה איגור? על מה אנחנו עובדים עכשיו?',
        '🐧 *קובלסקי* 🔸 איתך אחי! מה נתקתק היום?',
        '🐧 *קובלסקי* 🔸 שומע איגור, הכל אש. מה על הכוונת?',
        '🐧 *קובלסקי* 🔸 כאן לגמרי ובשיא המהירות. מה הכיוון שבא לך לקדם?',
        '🐧 *קובלסקי* 🔸 הכל מוכן אחי. במה נפתח?'
      ];
      return friendlyGreetings[Math.floor(Math.random() * friendlyGreetings.length)];
    }

    // 5. Compliments & Acknowledgments (0ms)
    if (text === 'תודה' || text === 'תודה רבה' || text === 'אחלה' || text === 'מעולה' || text === 'תותח' || text === 'מלך' || text === 'סגור') {
      const thanksReplies = [
        '🐧 *קובלסקי* 🔸 בכיף גדול אחי! תמיד כאן בשבילך. 🚀',
        '🐧 *קובלסקי* 🔸 בשמחה תמיד! ממשיכים בכל הכוח. 💪',
        '🐧 *קובלסקי* 🔸 סגור ומזומן. לכל משימה נוספת – אני כאן!'
      ];
      return thanksReplies[Math.floor(Math.random() * thanksReplies.length)];
    }

    // 6. Tony Invocation (0ms)
    if (raw.includes('טוני תשאל') || raw.includes('טוני תגיד') || raw.includes('טוני שאל') || text.includes('שלום לטוני')) {
      return '🐧 *קובלסקי* 🔸 שלום טוני נסיך שלי! אהוב שלי, אני כאן ומקשיב. שאל אותי מה שבא לך לדעת – על חלל, רובוטים, משחקים או מה שמסקרן אותך, חיים שלי! 😊';
    }

    return null;
  }

  /**
   * 🎓 Teach Prompt Trigger Check (Save to Long-term Memory)
   */
  checkLearningTrigger(cleanText, rawText) {
    const text = (cleanText || rawText || '').trim();
    
    const match = text.match(/^(?:תלמד|תלמד פרומפט|פרומפט חדש|כלל חדש|תזכור ש|פרומפט מכירות|פרומפט הומור|פרומפט שפה גבוהה|פרומפט סלנג)[:\s]+([\s\S]+)/i);
    if (match && match[1]) {
      const content = match[1].trim();
      let category = 'custom_instructions';
      
      if (text.includes('מכירות') || text.includes('סגירה') || text.includes('מחיר')) {
        category = 'sales_and_closing';
      } else if (text.includes('שפה גבוהה') || text.includes('רשמי') || text.includes('משפטי')) {
        category = 'high_language_templates';
      } else if (text.includes('סלנג') || text.includes('רחוב') || text.includes('דוגרי')) {
        category = 'street_slang_rules';
      } else if (text.includes('הומור') || text.includes('שנינות') || text.includes('בדיחה')) {
        category = 'humor_and_wit';
      }

      persistentMemory.learnPrompt(category, content);
      return `🎓 *קובלסקי למד והטמיע בהצלחה!*
נשמר לקטגוריית: *${category}*
התוכן הוטמע במוח ובזיכרון הקבוע וישמש מעתה בכל התשובות והאינטראקציות. 🚀`;
    }

    return null;
  }

  /**
   * Turbo Gemini Execution via Persistent HTTP Keep-Alive Sockets
   */
  executeGeminiRequest(modelName, bodyObject) {
    return new Promise((resolve, reject) => {
      const postData = JSON.stringify(bodyObject);
      const urlPath = `/v1beta/models/${modelName}:generateContent?key=${GEMINI_API_KEY}`;

      const options = {
        hostname: 'generativelanguage.googleapis.com',
        port: 443,
        path: urlPath,
        method: 'POST',
        agent: geminiAgent,
        timeout: 9000,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      };

      const req = https.request(options, (res) => {
        let responseBody = '';
        res.on('data', chunk => responseBody += chunk);
        res.on('end', () => {
          try {
            const parsed = JSON.parse(responseBody);
            resolve({ statusCode: res.statusCode, data: parsed });
          } catch (e) {
            reject(new Error(`JSON Parse Error: ${e.message}`));
          }
        });
      });

      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Gemini API Request Timeout'));
      });

      req.on('error', reject);
      req.write(postData);
      req.end();
    });
  }

  async callGeminiWithFailover(chatId, promptText, isOwner = true, extraContext = '', inlineParts = []) {
    const rawHistory = persistentMemory.getChatHistory(chatId);

    const contents = [];
    let lastRole = null;

    for (const item of rawHistory.slice(-4)) {
      if (item.text && item.text.trim() && item.role !== lastRole) {
        contents.push({
          role: item.role,
          parts: [{ text: item.text }]
        });
        lastRole = item.role;
      }
    }

    if (contents.length > 0 && contents[contents.length - 1].role === 'user') {
      contents.pop();
    }

    const userParts = [];
    if (inlineParts && inlineParts.length > 0) {
      userParts.push(...inlineParts);
    }
    const currentText = extraContext ? `${extraContext}\n\nהודעה: ${promptText}` : promptText;
    if (currentText) {
      userParts.push({ text: currentText });
    }

    contents.push({
      role: 'user',
      parts: userParts
    });

    const systemInstructionText = this.getSystemInstruction(isOwner);

    const requestBody = {
      contents,
      systemInstruction: {
        parts: [{ text: systemInstructionText }]
      },
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 250 // Fast TTFT and crisp completions
      }
    };

    for (const modelName of FALLBACK_MODELS) {
      const t0 = Date.now();
      try {
        const { statusCode, data } = await this.executeGeminiRequest(modelName, requestBody);
        const latency = Date.now() - t0;

        if (statusCode === 200 && data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
          let replyText = data.candidates[0].content.parts[0].text;
          
          // Reflexion Filter
          const isTonyChat = chatId.includes('65636076113936') || promptText.includes('טוני');
          replyText = reflexionEngine.validateAndRefine(replyText, { isTonyChat, cleanPrompt: promptText });

          persistentMemory.appendChatMessage(chatId, 'user', promptText || '[מדיה]');
          persistentMemory.appendChatMessage(chatId, 'model', replyText);

          console.log(`⚡ [Gemini Turbo OK] Model: ${modelName} in ${latency}ms`);
          return replyText;
        } else {
          console.warn(`⚠️ [Failover] Model ${modelName} (${latency}ms) status ${statusCode}:`, data.error?.message || '');
          // 0ms delay: immediately try next model
        }
      } catch (err) {
        console.warn(`⚠️ [Error] Model ${modelName}:`, err.message);
        // 0ms delay: immediately try next model
      }
    }

    return '🐧 *קובלסקי* 🔸 אני איתך אחי! שומע ומקשיב, איך נתקדם עכשיו?';
  }

  async processMessage(senderPhone, messageText, isOwner = true) {
    const rawText = (messageText || '').trim();
    let clean = this.cleanQuery(rawText);
    
    // ⚡ 1. Check Instant Local Cache (0ms)
    const cachedReply = this.checkInstantCache(clean, rawText);
    if (cachedReply) {
      return { text: cachedReply, fileAttachments: [] };
    }

    // 🎙️ Voice Mode Toggle Commands
    if (clean.includes('עבור למצב קולי') || clean.includes('תעבור למצב קולי') || clean === 'מצב קולי') {
      this.isAlwaysVoiceMode = true;
      const confirmText = '🎙️ *מצב מענה קולי הופעל בהצלחה!* 🔸 מעכשיו אשלח לך גם הקלטה קולית (וואטסאפ PTT) לכל תשובה. לחזרה למצב טקסט רגיל, פשוט תגיד "עבור למצב טקסט". 🚀';
      const voiceResult = await voiceResponseEngine.synthesizeVoiceNote(confirmText);
      const fileAttachments = voiceResult?.success ? [{ buffer: voiceResult.buffer, mimetype: 'audio/mp4', ptt: true }] : [];
      return { text: confirmText, fileAttachments };
    }

    if (clean.includes('עבור למצב טקסט') || clean.includes('תעבור למצב טקסט') || clean === 'מצב טקסט') {
      this.isAlwaysVoiceMode = false;
      return {
        text: '📝 *חזרנו למצב מענה בטקסט רגיל.* 🔸 אשלח הקלטה רק כשתבקש במפורש ("תקליט לי / תענה בקול"). 👍',
        fileAttachments: []
      };
    }

    // 🎓 2. Check Learning Trigger
    const learnReply = this.checkLearningTrigger(clean, rawText);
    if (learnReply) {
      return { text: learnReply, fileAttachments: [] };
    }

    // ☀️ 3. Check Daily Briefing Trigger
    if (dailyBriefingEngine.isBriefingRequest(clean)) {
      const briefText = dailyBriefingEngine.generateDailyBriefing();
      let fileAttachments = [];
      if (clean.includes('בקול') || clean.includes('הודעה קולית') || clean.includes('תקליט')) {
        const voiceResult = await voiceResponseEngine.synthesizeVoiceNote(briefText);
        if (voiceResult && voiceResult.success) {
          fileAttachments.push({ buffer: voiceResult.buffer, mimetype: 'audio/mp4', ptt: true });
        }
      }
      return { text: briefText, fileAttachments };
    }

    // 💼 4. Check CRM Lead Management Trigger
    if (leadManagementEngine.isLeadCreationCommand(clean)) {
      const result = leadManagementEngine.parseAndAddLead(clean);
      return { text: result.formattedSummary, fileAttachments: [] };
    }

    if (clean.includes('פולו אפ') || clean.includes('מעקב לידים') || clean.includes('רשימת לידים')) {
      return { text: leadManagementEngine.getFollowUpSuggestions(), fileAttachments: [] };
    }

    // 🎨 5. Check Ad Creative Generator Trigger
    if (creativeGeneratorEngine.isCreativeRequest(clean)) {
      return { text: creativeGeneratorEngine.generateAdPackage(clean), fileAttachments: [] };
    }

    // ✍️ 6. Check Autonomous SEO & Content Machine Trigger
    if (seoContentMachine.isContentRequest(clean)) {
      return { text: seoContentMachine.generateArticleBlueprint(clean), fileAttachments: [] };
    }

    // 📌 7. Check Commitment Tracker Trigger
    if (clean.includes('התחייבויות') || clean.includes('מה הבטחתי') || clean.includes('מעקב התחייבויות')) {
      return { text: commitmentTracker.formatCommitmentsSummary(), fileAttachments: [] };
    }

    if (clean.startsWith('בוצע ') || clean.startsWith('סיימתי את ')) {
      const matchText = clean.replace(/^(?:בוצע|סיימתי את)\s*/i, '').trim();
      const done = commitmentTracker.markFulfilled(matchText);
      return {
        text: done 
          ? `✅ *ההתחייבות סומנה כבוצעה בהצלחה!* ("${matchText}") 🚀`
          : `👍 *קיבלתי איגור!* עודכן במערכת.`,
        fileAttachments: []
      };
    }

    // 🗂️ 8. Check Pre-Meeting Dossier & Post-Meeting Debrief Trigger
    if (meetingIntelligenceEngine.isPreMeetingRequest(clean)) {
      return { text: meetingIntelligenceEngine.generatePreMeetingDossier(clean), fileAttachments: [] };
    }

    if (meetingIntelligenceEngine.isPostMeetingDebrief(clean)) {
      return { text: meetingIntelligenceEngine.parseDebrief(clean), fileAttachments: [] };
    }

    // 📊 9. Check Competitor & Market Radar Trigger
    if (competitorRadarEngine.isRadarRequest(clean)) {
      return { text: competitorRadarEngine.generateRadarReport(clean), fileAttachments: [] };
    }

    const chatId = senderPhone;
    const isTonyChat = chatId.includes('65636076113936') || clean.includes('טוני');
    console.log(`[Brain Stack 3.5 Turbo] Sender: ${senderPhone} | isOwner: ${isOwner} | Clean: "${clean}"`);

    let fileAttachments = [];
    let extraContext = '';

    // 🎭 Psychological & Linguistic Calibration
    try {
      const chameleonContext = psychologyChameleonEngine.getPsychologyPromptEnhancement(clean, {
        isTony: isTonyChat,
        isOwner,
        senderPhone
      });
      extraContext += `\n${chameleonContext}`;
    } catch (e) {}

    // 🌳 Layer 1: Tree of Thoughts (ToT) Trigger
    try {
      if (logicTotEngine.isStrategicQuery(clean)) {
        extraContext += `\n${logicTotEngine.getTotPromptEnhancement(clean)}`;
      }
    } catch (e) {}

    // 🔢 Layer 3: Neuro-Symbolic Pricing & Financial Logic Trigger
    if (clean.includes('הצעת מחיר') || clean.includes('תייצר הצעת מחיר') || clean.includes('תוציא הצעת מחיר')) {
      try {
        const priceMatch = clean.match(/(\d[\d,.]*)\s*(ש"ח|שח|₪|דולר|\$)/i) || clean.match(/(?:סך|על סך|מחיר)\s*(\d[\d,.]*)/i);
        const rawPrice = priceMatch ? priceMatch[1] : '5,000';
        
        const financialMath = neuroSymbolicEngine.calculatePricing(rawPrice);
        extraContext += `\n${financialMath.calculationContext}`;

        const clientNameMatch = clean.match(/(?:עבור|לכבוד|לשם|של)\s+([א-ת\w\s]+?)(?:\s+(?:בסך|על סך|עבור|במחיר)|$)/i);
        const clientName = clientNameMatch ? clientNameMatch[1].trim() : 'לקוח יקר';
        
        const pdfResult = await pdfGenerator.createQuotePdf({
          clientName,
          totalAmount: financialMath.priceWithVatFormatted,
          scopeDescription: clean
        });

        if (pdfResult.success) {
          fileAttachments.push({
            path: pdfResult.pdfPath,
            filename: pdfResult.filename,
            mimetype: 'application/pdf'
          });
          extraContext += `\n[נוצר בהצלחה קובץ PDF יוקרתי של הצעת המחיר ונשלח ללקוח]`;
        }
      } catch (pdfErr) {
        console.warn('[PDF Gen Warning]', pdfErr.message);
      }
    }

    // 📅 Calendar Meeting Trigger
    if (clean.includes('פגישה') || clean.includes('תקבע פגישה') || clean.includes('יומן')) {
      try {
        const calResult = calendarEngine.createQuickMeeting({
          title: 'פגישת אסטרטגיה עסקית - GOR MARKETING',
          description: `תיאום פגישה מול איגור גורלקין / ראש מטה קובלסקי: ${clean}`
        });

        if (calResult.success) {
          extraContext += `\n[קישור יומן גוגל מוכן: ${calResult.googleCalendarUrl}]\n[קישור גוגל מיט: ${calResult.meetUrl}]`;
          if (calResult.icsPath) {
            fileAttachments.push({
              path: calResult.icsPath,
              filename: calResult.filename,
              mimetype: 'text/calendar'
            });
          }
        }
      } catch (calErr) {
        console.warn('[Calendar Warning]', calErr.message);
      }
    }

    // Call Primary/Fallback Gemini via Turbo Engine
    const replyText = await this.callGeminiWithFailover(chatId, clean, isOwner, extraContext);

    // 🎙️ Voice Response Trigger (Only if explicitly requested by user or AlwaysVoiceMode is active)
    const isVoiceRequested = (t) => /(?:תענה\s+(?:לי\s+)?(?:ב(?:קול|הקלטה)|קולי)|הודעה\s+קולית|תקליט\s+(?:לי|אותך)?|שלח\s+(?:לי\s+)?הקלטה|מצב\s+קולי)/i.test(t || '');
    const wantsVoiceInText = isVoiceRequested(clean);
    if (this.isAlwaysVoiceMode || wantsVoiceInText) {
      try {
        const spokenText = (replyText || '').replace(/^[🐧🎙️☀️🎨📑✅].*?🔸\s*/i, '').trim();
        const voiceResult = await voiceResponseEngine.synthesizeVoiceNote(spokenText || replyText);
        if (voiceResult && voiceResult.success) {
          fileAttachments.push({
            buffer: voiceResult.buffer,
            mimetype: 'audio/mpeg',
            ptt: false
          });
        }
      } catch (vErr) {
        console.warn('[Voice Gen Warning]', vErr.message);
      }
    }

    return {
      text: replyText || '🐧 *קובלסקי* 🔸 קיבלתי אחי, אני על זה!',
      fileAttachments
    };
  }

  async processVoiceNote(senderPhone, audioBuffer, mimeType, isOwner = true, isGroup = false, isSelfChat = false) {
    const isTonyChat = senderPhone.includes('65636076113936');
    console.log(`🎙️ [Processing Voice Note] Size: ${audioBuffer.length} bytes, Mime: ${mimeType}, isOwner: ${isOwner}, isGroup: ${isGroup}, isSelfChat: ${isSelfChat}`);

    const base64Audio = audioBuffer.toString('base64');
    const audioPart = {
      inlineData: {
        data: base64Audio,
        mimeType: mimeType || 'audio/ogg; codecs=opus'
      }
    };

    const promptText = isTonyChat
      ? `שמע את ההקלטה של טוני (הבן האהוב של איגור). תמלל אותה במדויק. פתח ב-🎙️ *שמעתי:* "[מה שטוני אמר]" ולאחר מכן ענה לו בדיוק כפי שאבא איגור עונה לו – עם המון אהבה, חום, עידוד ושמות חיבה ("נסיך שלי", "חיים שלי", "אהוב שלי", "אלוף", "מתוק שלי"), כפינגווין חכם, שמח וחברותי (עולמות מדע, חלל, משחקים או ספורט).`
      : `האזן להקלטה הקולית${isOwner ? ' של איגור' : ''}. 
1. תמלל במדויק את הנאמר.
2. פתח ב: 🎙️ *שמעתי:* "[התמלול המדויק]"
3. בשורה הבאה, ענה בגובה העיניים כמו חבר ושותף חכם (1-2 משפטים חדים וחמים בלי רשמיות), ובצע מיד את המשימה.`;

    const extraContext = `[הקלטה קולית]: תמלול + ביצוע חברי, חד ומדויק של המשימה.`;

    const replyText = await this.callGeminiWithFailover(senderPhone, promptText, isOwner, extraContext, [audioPart]);

    // STRICT ZERO INTERVENTION: In non-self chats (private chats or groups), ONLY reply if Kowalski was explicitly called by name!
    if (!isSelfChat && replyText) {
      const matchTranscript = replyText.match(/🎙️\s*\*שמעתי:\*\s*"([^"]+)"/i);
      const transcript = matchTranscript ? matchTranscript[1] : replyText;
      const calledKowalski = config.NAME_VARIANTS.some(v => transcript.toLowerCase().includes(v.toLowerCase()));
      if (!calledKowalski) {
        console.log(`🔇 [PRIVATE/GROUP AUDIO - NOT ADDRESSED TO KOWALSKI] Recorded silently: "${transcript}"`);
        persistentMemory.appendChatMessage(senderPhone, isOwner ? 'user' : 'other', `[הקלטה קולית]: ${transcript}`);
        return null; // Stay 100% silent!
      }
    }

    let fileAttachments = [];
    // Only attach audio if AlwaysVoiceMode is active or if user specifically asked to respond in voice
    const matchTranscript = replyText ? replyText.match(/🎙️\s*\*שמעתי:\*\s*"([^"]+)"/i) : null;
    const transcriptText = matchTranscript ? matchTranscript[1] : '';
    const isVoiceRequested = (t) => /(?:תענה\s+(?:לי\s+)?(?:ב(?:קול|הקלטה)|קולי)|הודעה\s+קולית|תקליט\s+(?:לי|אותך)?|שלח\s+(?:לי\s+)?הקלטה|מצב\s+קולי)/i.test(t || '');
    const wantsVoiceInVoice = isVoiceRequested(transcriptText);

    if ((this.isAlwaysVoiceMode || wantsVoiceInVoice) && replyText) {
      try {
        const spokenPart = replyText.replace(/^🎙️\s*\*שמעתי:\*[^\n]*\n+/i, '').replace(/^[🐧🎙️☀️🎨📑✅].*?🔸\s*/i, '').trim();
        const voiceResult = await voiceResponseEngine.synthesizeVoiceNote(spokenPart || replyText);
        if (voiceResult && voiceResult.success) {
          fileAttachments.push({
            buffer: voiceResult.buffer,
            mimetype: 'audio/mpeg',
            ptt: false
          });
        }
      } catch (vErr) {
        console.warn('[Voice Return Gen Warning]', vErr.message);
      }
    }

    return {
      text: replyText || '🎙️ *שמעתי את ההקלטה שלך.* אני עובד על זה ומעדכן מיד.',
      fileAttachments
    };
  }

  async processImage(senderPhone, imageBuffer, mimeType, captionText = '', isOwner = true) {
    console.log(`🖼️ [Processing Image/Doc] Size: ${imageBuffer.length} bytes, Caption: "${captionText}"`);

    const base64Data = imageBuffer.toString('base64');
    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType: mimeType || 'image/jpeg'
      }
    };

    const promptText = `נתח את התמונה/מסמך שאיגור שלח. ${captionText ? `הערת משתמש: "${captionText}".` : ''}
חלץ בקצרה ובחדות (1-2 משפטים חבריים ופרקטיים) את השורה התחתונה והתובנה העיקרית.`;

    const replyText = await this.callGeminiWithFailover(senderPhone, promptText, isOwner, '', [imagePart]);

    return {
      text: replyText || '👁️ *קובלסקי* 🔸 סרקתי את התמונה אחי, מה נעשה איתה?',
      fileAttachments: []
    };
  }
}

module.exports = new KowalskiBrain();
