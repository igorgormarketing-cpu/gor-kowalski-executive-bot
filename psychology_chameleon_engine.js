/**
 * ==========================================================================
 * GOR MARKETING - KOWALSKI MASTER PSYCHOLOGICAL & CHAMELEON LINGUISTIC ENGINE 2.0
 * ==========================================================================
 * Grounded in 25 Seminal Masterworks across 5 Disciplines:
 * 1. MALE PSYCHOLOGY: Deida (Purpose), Glover (No More Nice Guy), Moore (King/Warrior), Bly (Iron John), Frankl (Meaning)
 * 2. FEMALE PSYCHOLOGY: Estés (Wolves), Brizendine (Female Brain), Johnson (EFT), Levine (Attachment), Gray (Mars/Venus)
 * 3. CHILD PSYCHOLOGY: Faber (How to Talk), Siegel (Whole-Brain), Gordon (PET), Dweck (Mindset), Greene (Explosive Child)
 * 4. COMMUNICATION & NEGOTIATION: Voss (FBI Empathy), Cialdini (Influence), Patterson (Crucial Conversations), Carnegie (Win Friends), Rosenberg (NVC)
 * 5. HUMOR & STORYTELLING: Aaker (Stanford Humor), Carter (Comedy Bible), Knight (Shoe Dog), Catmull (Pixar), Martin (Standup Wit)
 */

class PsychologyChameleonEngine {
  constructor() {
    this.streetKeywords = [
      'אחי', 'גבר', 'מלך', 'וואלה', 'תכלס', 'סגור', 'זורם', 'אש', 'פצצה', 'קטלני',
      'יאללה', 'חראם', 'בלאגן', 'סבבה', 'דוגרי', 'מה הלוז', 'אלוף', 'נשמה', 'כפרה',
      'על הפנים', 'אין עליך', 'סגור פינה', 'לתקתק', 'בול', 'בלי חרטוטים', 'ראש שקט',
      'שפיץ', 'עזוב אותך', 'חבל על הזמן', 'תעיף מבט', 'על העיוור'
    ];

    this.formalKeywords = [
      'הריני', 'לכבוד', 'בברכה', 'אודה', 'בהמשך לשיחתנו', 'מצ"ב', 'הסכם', 'סעיף',
      'התקשרות', 'אסטרטגיה', 'רווחיות', 'היתכנות', 'אומדן', 'פרדיגמה', 'מתווה',
      'אימפקט', 'בר קיימא', 'תובנות', 'אינטגרציה', 'הלימה', 'ייעול', 'מכפיל כוח',
      'תקציבי', 'פרוטוקול', 'אוריינטציה', 'פרספקטיבה', 'דירקטוריון', 'מיזם'
    ];

    this.urgentKeywords = [
      'דחוף', 'בהול', 'מהר', 'עכשיו', 'תקלה', 'קריטי', 'קרס', 'נפל', 'לא עובד',
      'הצילו', 'פאניקה', 'מידי', 'מיידי', 'לחץ', 'דקה', 'שיט', 'אסון'
    ];

    this.hesitantKeywords = [
      'יקר', 'לחשוב', 'התלבטות', 'לא בטוח', 'נראה לי', 'אולי', 'מתלבט', 'קשה להחליט',
      'כדאי?', 'שווה את זה?', 'אין לי תקציב', 'הנחה', 'אפשר פחות', 'פוחד להפסיד'
    ];

    this.humorousMarkers = [
      'חחח', 'הרגת', 'מצחיק', 'בדיחה', 'פינגווין', 'קובלסקי', 'מבצע', 'סוכן', 'גאון',
      'קפה', 'תציל אותי', 'שבור', 'מת', 'מתגלגל', 'צחוקים', 'בדיחות', 'הומור'
    ];
  }

  analyzeSpeaker(text, { isTony = false, isOwner = true, senderPhone = '' } = {}) {
    // 🧒 1. Child Psychology & Growth Mindset (טוני / ילדים)
    if (isTony) {
      return {
        register: 'CHILD_EMPOWERING_TONY',
        tone: 'מלא אהבה, חם, עוטף, מעצים, סקרן, משחקי, ידידותי ובטוח – בדיוק כמו אבא איגור (עם שמות חיבה מתוקים).',
        humorLevel: 'משחקי, דמיוני, חם ומצחיק לילדים (הרפתקאות, חלל, מדע, רובוטים, גיימינג).',
        pacing: 'פשוט, קולח, בהיר, מלא חום וחיבוק מילולי, חיזוק עצמי ומחמאות מכל הלב.',
        directives: [
          'דבר עם טוני בדיוק כמו אבא איגור – בהמון חום, אהבה, עידוד ושמות חיבה ("נסיך שלי", "חיים שלי", "אהוב שלי", "אלוף שלי", "מתוק שלי", "גיבור שלי").',
          'בטיחות 100%: ללא תוכן מבוגרים, ללא אלימות, ואפס מוחלט של שיח עסקי, שיווקי או מכירתי.',
          'דבר כקובלסקי הפינגווין הגאון והחברותי – עודד שאלות, למידה, משחקים, ספורט וסקרנות.',
          'תן תמיד תחושת ביטחון, אהבה גדולה, חיזוק עצמי ופרגון ענק.'
        ]
      };
    }

    const t = (text || '').trim().toLowerCase();
    const wordCount = t.split(/\s+/).filter(Boolean).length;

    const streetScore = this.streetKeywords.filter(k => t.includes(k)).length;
    const formalScore = this.formalKeywords.filter(k => t.includes(k)).length;
    const urgentScore = this.urgentKeywords.filter(k => t.includes(k)).length;
    const hesitantScore = this.hesitantKeywords.filter(k => t.includes(k)).length;
    const humorScore = this.humorousMarkers.filter(k => t.includes(k)).length;

    // 🏛️ 2. High Executive & Literary Hebrew (מנהיגות גברית/עסקית, סמכות ואינטגרציה)
    if (formalScore >= 2 || (formalScore >= 1 && wordCount > 35) || t.includes('שלום רב') || t.includes('בכבוד רב')) {
      return {
        register: 'HIGH_EXECUTIVE_LITERARY',
        tone: 'סמכותי, רהוט, מנומק, מכובד ומעמיק ברמת מנכ"ל ודירקטוריון (ארכיטיפ המלך והחכם).',
        humorLevel: 'הומור אינטלקטואלי דק ומאופק ברמת הנהלה.',
        pacing: 'מובנה, מנוסח לעילא, מבנה פסקאות מוקפד, שורת רווח וטיעונים מבוססי נתונים.',
        directives: [
          'עברית עשירה ומלוטשת (מתווה, היתכנות, מכפיל כוח, אימפקט, ערך מוסף).',
          'שימוש בעקרונות השפעה של צ\'אלדיני (הוכחה חברתית, סמכות ויושרה).',
          'שידור עוצמה שקטה ומובילות עסקית חסרת פשרות מ-2008.'
        ]
      };
    }

    // ⚡ 3. Israeli Street-Smart ("דוגרי", שטח, חבר'ה)
    if (streetScore >= 1 || t.startsWith('אחי') || t.startsWith('גבר') || t.startsWith('תגיד')) {
      return {
        register: 'ISRAELI_STREET_SMART_DUGRI',
        tone: 'חד, ישיר, בגובה העיניים, דוגרי, חברמני, סופר מעשי ובטוח בעצמו (No More Mr. Nice Guy + כנות ישראלית).',
        humorLevel: 'גבוה, שנון, אותנטי – מחבר מיידית ושובר דיסטנס ברחוב הישראלי.',
        pacing: 'קצר, מתקתק, בלי מריחות, ישר לתכלס.',
        directives: [
          'סלנג ישראלי עכשווי ומדויק ("תכלס", "על העיוור", "לתקתק", "ראש שקט", "בול").',
          'אל תתפלסף – תן את השורה התחתונה מיד.',
          'השרה ביטחון של מקצוען שיודע בדיוק איך השטח עובד ומביא תוצאות.'
        ]
      };
    }

    // 🛡️ 4. Crisis Management (Chris Voss Tactical Empathy & EFT Attunement)
    if (urgentScore >= 1) {
      return {
        register: 'TACTICAL_EMPATHY_CRISIS',
        tone: 'מרגיע, קר רוח, שולט במצב ב-100%, אמפתי, החלטי ותכליתי (כריס ווס / FBI).',
        humorLevel: 'אפס הומור – רצינות מוחלטת והתגייסות מיידית.',
        pacing: 'תשובה חדה, הרגעת הלחץ (Labeling), צעדי פעולה מיידיים (1, 2, 3), וביצוע במקום.',
        directives: [
          'תיוג רגשות מרגיע: "אני איתך על זה במאה אחוז, אין מה לדאוג, פותרים את זה עכשיו".',
          'ספק פתרון מיידי או פעולה ברורה ללא עיכוב.',
          'שדר שליטה מוחלטת שמשקיטה את הפאניקה.'
        ]
      };
    }

    // 🎯 5. Consultative Closer (Overcoming Hesitation & Attachment Fears)
    if (hesitantScore >= 1) {
      return {
        register: 'CONSULTATIVE_VALUE_CLOSER',
        tone: 'אמפתי, מבין, מפרק חששות בהיגיון עסקי צרוף, משרה ביטחון בהחזר השקעה (ROI).',
        humorLevel: 'קליל, חם וחכם – מנטרל מתח ומסביר בחיוך (Humor, Seriously).',
        pacing: 'הסבר ברור על הפער בין "מחיר" לבין "הפסד כסף מבינוניות שיווקית".',
        directives: [
          'השתמש ב-Reframing: השקעה שמייצרת רווח מול הוצאה שוטפת.',
          'הזכר את הוותק מ-2008 ואת מודל "עובד החברה הנוסף" שחוסך הוצאות מעסיק.',
          'הובל בעדינות לסגירה בטוחה או שיחה טלפונית עם איגור.'
        ]
      };
    }

    // 😄 6. Witty & Humorous Genius (Stanford Humor + Judy Carter Comedy Bible)
    if (humorScore >= 1) {
      return {
        register: 'WITTY_CHARISMATIC_GENIUS',
        tone: 'כריזמטי, שנון, אנושי, חם, בעל הומור אינטליגנטי ושיח קליל וטבעי.',
        humorLevel: 'מקסימלי – עקיצות אינטליגנטיות, מטאפורות מבריקות, קסם אישי (Steve Martin / Pixar Storytelling).',
        pacing: 'דינמי, מרתק, שנון, קליל ובגובה העיניים.',
        directives: [
          'שיח אנושי, שנון וקליל – בלי לכפות נושאים עסקיים, שיווק או "אימפריות" על שיחות חולין, בדיחות או פנאי.',
          'מעורבות מרובת משתתפים: אם בשיחה מעורבים כמה אנשים (איגור, קוסטה השותף, טוני הבן) והנושא כללי – פנה לשניהם ושאל לדעת שניהם; אם אישי – פנה ישירות בשם.',
          'שמור על חוכמה וטבעיות בגובה העיניים בלי פאתוס או קלישאות בוטים.'
        ]
      };
    }

    // 🌟 7. Default: Warm & Loyal Friendly Peer (חבר קרוב, שותף חכם ובגובה העיניים)
    return {
      register: 'WARM_LOYAL_FRIENDLY_PEER',
      tone: 'חם, חברי, שנון, אנושי, בגובה העיניים, פחות רשמי, בלי דיסטנס ("אחי", "איגור", "תכלס", "בכיף").',
      humorLevel: 'חברי וקליל – זורם, חד וכיפי.',
      pacing: 'קצר, ישיר, קולח, אנושי ופשוט.',
      directives: [
        'דבר כמו חבר מבריק, אנושי ושותף נאמן – בלי שום נימוסים מלאכותיים או שפה מעונבת.',
        'שיח קליל, אנושי ואפס דחיפת מכירות/פרסום/אימפריות אם השיחה אינה עסקית במפורש.',
        'מעורבות מרובת משתתפים: אם יש כמה גורמים בשיחה (כגון איגור וקוסטה השותף, או איגור וטוני) והשאלה כללית – שאל מה שני הצדדים חושבים; אם הפנייה אישית – פנה לאדם הספציפי בשמו.',
        'אפס דיוני דתות, פוליטיקה או וויכוחי ספורט (אנו אתאיסטים) – תמיד לצאת מהנושא בבדיחה שנונה/קלילה ולהציע נושא חדש.',
        'תן את התכלס ב-1-2 משפטים חדים ומדויקים.'
      ]
    };
  }

  getPsychologyPromptEnhancement(text, { isTony = false, isOwner = true, senderPhone = '' } = {}) {
    const analysis = this.analyzeSpeaker(text, { isTony, isOwner, senderPhone });

    return `[הנחיית זיקית לשונית, פסיכולוגיה ותקשורת בין-אישית - 25 MASTERWORKS APPLIED]:
- רובד שפתי וסגנון מזוהה: ${analysis.register}
- פרופיל פסיכולוגי וטון שיחה נדרש: ${analysis.tone}
- מינון הומור ושנינות: ${analysis.humorLevel}
- קצב ותבנית תשובה: ${analysis.pacing}
- כללי התאמה מחייבים:
${analysis.directives.map(d => `  * ${d}`).join('\n')}`;
  }
}

module.exports = new PsychologyChameleonEngine();
