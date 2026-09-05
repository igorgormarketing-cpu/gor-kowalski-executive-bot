/**
 * ==========================================================================
 * GOR MARKETING - ACADEMIC HEBREW LINGUISTICS, GRAMMAR & SYNTAX MASTER ENGINE
 * ==========================================================================
 * Based on the Canonical Corpus of the Academy of the Hebrew Language
 * (האקדמיה ללשון העברית), Prof. M.Z. Segal, Avraham Even-Shoshan, Yitzhak Peretz,
 * Abba Bendavid, and Reuven Sivan:
 *
 * 1. תורת ההגה והפונטיקה (Phonology): הידמות עיצורים (צ'+ט', ת'+ט'), חטפים, בג"ד כפ"ת.
 * 2. תורת הצורות (Morphology): שבעת הבניינים, גזרות השלמים והעלולים, נטיית השמות, שורשים ומשקלים.
 * 3. שם המספר והכמויות (Numerals): התאם מלא במין, נפרד ונסמך, "פי כמה" בזכר תמיד, מספר סודר.
 * 4. תחביר והצרכה (Syntax & Government): התאם נושא-נשוא, סמיכות ויידוע, הצרכת מילות יחס (לשלוט ב-).
 * 5. בידול מילות יחס וסיבתיות: 'בזכות' (חיובי בלבד) מול 'בשל/מפאת' (שלילי/ניטרלי), 'אל' מול 'על', 'אם' מול 'עם'.
 * 6. כללי הכתיב המלא (חסר הניקוד): הכפלת יו"ד ווי"ו עיצוריות באמצע מילה, אי-הכפלה בראש מילה או לצד אמות קריאה.
 */

class HebrewLinguisticsEngine {
  constructor() {
    this.canonicalBooks = [
      {
        title: "ספר הדקדוק העברי השלם",
        authors: "פרופ' משה צבי סגל ויצחק פרץ",
        scope: "תורת ההגה, נטיית השמות והפעלים, שבעת הבניינים, גזרות השלמים, נחי פ\"א/ע\"ו/נל\"ה וכפולים."
      },
      {
        title: "החלטות האקדמיה ללשון העברית בדקדוק ובכתיב חסר הניקוד",
        authors: "האקדמיה ללשון העברית (מהדורות תשנ\"ד–תשפ\"ד)",
        scope: "כללי הכתיב המלא, הכפלת יו\"ד ווי\"ו, פיסוק תקני, תעתיק לועזי וחידושי מונחים."
      },
      {
        title: "מדריך לשון לרדיו, לטלוויזיה ולתקשורת הכתובה",
        authors: "אבא בנדויד",
        scope: "תקינות הניסוח, מניעת שיבושי לשון נפוצים, דיוק תחבירי והצרכת מילות יחס תקינה."
      },
      {
        title: "מילון אבן-שושן המורחב ורב-מילים",
        authors: "אברהם אבן-שושן ופרופ' יעקב שויקה",
        scope: "אטימולוגיה, שורשים ומשקלים, גזירה תניינית, רובדי לשון (מקרא, חז\"ל, ימי הביניים, עברית חדשה)."
      },
      {
        title: "לקסיקון לשיפור הלשון ודיוקי הגהה",
        authors: "ראובן סיוון ועמיקם אסם (\"ודייקת\")",
        scope: "שיבושי ש/ס, ט/ת, א/ע, בידול סיבתיות (בזכות/בשל), שם המספר, כפולות וסמיכויות כפולות."
      }
    ];

    this.corrections = [
      // 1. Phonetic & Consonant Assimilation (הידמות עיצורים והבלעה: צ'+ט', ת'+ט')
      { regex: /\bיצתרך\b/g, replace: 'יצטרך' },
      { regex: /\bלהצתרך\b/g, replace: 'להצטרך' },
      { regex: /\bנצתרך\b/g, replace: 'נצטרך' },
      { regex: /\bאצתרך\b/g, replace: 'אצטרך' },
      { regex: /\bתצתרך\b/g, replace: 'תצטרך' },
      { regex: /\bהצתרכות\b/g, replace: 'הצטרכות' },
      { regex: /\bהצתיד\b/g, replace: 'הצטייד' },
      { regex: /\bלהצתיד\b/g, replace: 'להצטייד' },
      { regex: /\bהצטיד\b/g, replace: 'הצטייד' },
      { regex: /\bהצתין\b/g, replace: 'הצטיין' },
      { regex: /\bהצטלם\b/g, replace: 'הצטלם' },
      { regex: /\bהצטבר\b/g, replace: 'הצטבר' },
      { regex: /\bהצתבר\b/g, replace: 'הצטבר' },
      { regex: /\bהתצבר\b/g, replace: 'הצטבר' },

      // 2. Spelling Corrections: Sin/Samech, Tet/Tav, Kaph/Qoph (ש/ס, ט/ת, כ/ק)
      { regex: /\bהסכלה\b/g, replace: 'השכלה' },
      { regex: /\bהסכלתי\b/g, replace: 'השכלתי' },
      { regex: /\bהסכלתו\b/g, replace: 'השכלתו' },
      { regex: /\bמשכיל\b/g, replace: 'משכיל' },
      { regex: /\bהסכיל\b/g, replace: 'השכיל' },
      { regex: /\bהיכפית\b/g, replace: 'היקפית' },
      { regex: /\bהיכפי\b/g, replace: 'היקפי' },
      { regex: /\bכירורגיט\b/g, replace: 'כירורגית' },
      { regex: /\bטכנולוגיט\b/g, replace: 'טכנולוגית' },
      { regex: /\bאסטרטגיט\b/g, replace: 'אסטרטגית' },
      { regex: /\bדיגיטליט\b/g, replace: 'דיגיטלית' },

      // 3. Negative Commands vs Prepositions (אל לשלילת עתיד/ציווי לעומת על ליחס)
      { regex: /\bועל תבזבז\b/g, replace: 'ואל תבזבז' },
      { regex: /\bעל תבזבז\b/g, replace: 'אל תבזבז' },
      { regex: /\bועל תדאג\b/g, replace: 'ואל תדאג' },
      { regex: /\bעל תדאג\b/g, replace: 'אל תדאג' },
      { regex: /\bועל תחשוש\b/g, replace: 'ואל תחשוש' },
      { regex: /\bעל תחשוש\b/g, replace: 'אל תחשוש' },
      { regex: /\bועל תהסס\b/g, replace: 'ואל תהסס' },
      { regex: /\bעל תהסס\b/g, replace: 'אל תהסס' },
      { regex: /\bועל תוותר\b/g, replace: 'ואל תוותר' },
      { regex: /\bעל תוותר\b/g, replace: 'אל תוותר' },
      { regex: /\bועל תשכח\b/g, replace: 'ואל תשכח' },
      { regex: /\bעל תשכח\b/g, replace: 'אל תשכח' },

      // 4. "Pi Kama" Multiplier Must Always Be Masculine (פי כמה - תמיד בזכר!)
      { regex: /\bפי שלוש\b/g, replace: 'פי שלושה' },
      { regex: /\bפי ארבע\b/g, replace: 'פי ארבעה' },
      { regex: /\bפי חמש\b/g, replace: 'פי חמישה' },
      { regex: /\bפי שש\b/g, replace: 'פי שישה' },
      { regex: /\bפי שבע\b/g, replace: 'פי שבעה' },
      { regex: /\bפי שמונה\b/g, replace: 'פי שמונה' },
      { regex: /\bפי תשע\b/g, replace: 'פי תשעה' },
      { regex: /\bפי עשר\b/g, replace: 'פי עשרה' },
      { regex: /\bפי עשרים\b/g, replace: 'פי עשרים' },
      { regex: /\bפי מאה\b/g, replace: 'פי מאה' },
      { regex: /\bפי אלף\b/g, replace: 'פי אלף' },

      // 5. Academy Full Spelling Standard (תקן הכתיב המלא חסר הניקוד)
      { regex: /\bפרוייקט\b/g, replace: 'פרויקט' },
      { regex: /\bפרוייקטים\b/g, replace: 'פרויקטים' },
      { regex: /\bבפרוייקט\b/g, replace: 'בפרויקט' },
      { regex: /\bהפרוייקט\b/g, replace: 'הפרויקט' },
      { regex: /\bמסויימת\b/g, replace: 'מסוימת' },
      { regex: /\bמסויימים\b/g, replace: 'מסוימים' },
      { regex: /\bמסויימות\b/g, replace: 'מסוימות' },
      { regex: /\bתכנית\b/g, replace: 'תוכנית' },
      { regex: /\bתכניות\b/g, replace: 'תוכניות' },
      { regex: /\bהתכנית\b/g, replace: 'התוכנית' },
      { regex: /\bהתכניות\b/g, replace: 'התוכניות' },
      { regex: /\bנסיון\b/g, replace: 'ניסיון' },
      { regex: /\bנסיונות\b/g, replace: 'ניסיונות' },
      { regex: /\bהנסיון\b/g, replace: 'הניסיון' },
      { regex: /\bהנסיונות\b/g, replace: 'הניסיונות' },
      { regex: /\bשרות\b/g, replace: 'שירות' },
      { regex: /\bשרותים\b/g, replace: 'שירותים' },
      { regex: /\bעקביות\b/g, replace: 'עקביות' },

      // 6. Typographical & Morphological Refinements
      { regex: /\bלכוד\b/g, replace: 'לחוד' },
      { regex: /\bמבנ=פנים\b/g, replace: 'מבפנים' },
      { regex: /\bהבית ספר\b/g, replace: 'בית הספר' },
      { regex: /\bהאיש עסקים\b/g, replace: 'איש העסקים' },
      { regex: /\bהבעל עסק\b/g, replace: 'בעל העסק' },
      { regex: /\bהעורך דין\b/g, replace: 'עורך הדין' }
    ];
  }

  /**
   * Refine and polish text according to the Academy of the Hebrew Language
   */
  refineText(text) {
    if (!text || typeof text !== 'string') return text;
    let refined = text;

    for (const rule of this.corrections) {
      refined = refined.replace(rule.regex, rule.replace);
    }

    return refined;
  }

  /**
   * Complete linguistic knowledge directives for the system prompt
   */
  getLinguisticsDirectives() {
    return `🏛️ [פרוטוקול עריכה לשונית, תחביר, דקדוק ומומחיות לשון עברית - תקן האקדמיה ללשון העברית]:
אתה שולט באופן מוחלט וחסר פשרות בכל רובדי השפה העברית, ספרי הדקדוק של משה צבי סגל, אברהם אבן-שושן, אבא בנדויד וראובן סיוון:
1. שם המספר:
   - התאם מלא במין ובמספר לשם העצם (זכר: שלושה, ארבעה, חמישה, עשרה / נקבה: שלוש, ארבע, חמש, עשר).
   - "פי כמה" וכפולות – תמיד בזכר! (פי שלושה, פי ארבעה, פי חמישה, פי עשרה, פי כמה וכמה – לעולם לא "פי שלוש"!).
   - מספר סודר: "הפרק השלישי" (ולא "פרק שלוש"), "הפעם הראשונה", "השנה השנייה".
2. כתיב מלא תקני (חסר ניקוד לפי האקדמיה):
   - יו"ד עיצורית באמצע מילה נכפלת ("בניין", "קמפיין", "שיווק", "ניסיון", "מסוים", "דיגיטליים").
   - יו"ד לא תיכפל ליד אם קריאה ("פרויקט", "תוכנית", "מומחה").
   - וי"ו עיצורית באמצע מילה נכפלת ("שיווק", "צוות", "חוויה").
3. תורת ההגה והידמות עיצורים:
   - בניין התפעל לפני צ' הופך ל-צט ("יצטרך", "להצטייד", "הצטבר", "הצטיין" – לעולם לא "יצתרך").
4. מילות יחס, הצרכה וסיבתיות:
   - "בזכות" / "הודות ל-" – אך ורק לתוצאה חיובית ורצויה.
   - "בשל" / "מפאת" / "עקב" – לסיבה שלילית או ניטרלית.
   - הצרכה תקינה: "לשלוט ב-" (ולא "לשלוט על"), "להתמקד ב-", "להתעניין ב-".
   - בידול: "אל" לשלילה/ציווי לעומת "על" ליחס; "אם" לתנאי לעומת "עם" לחיבור; "לא" לשלילה לעומת "לו" לתנאי.
5. סמיכות ויידוע כפול:
   - יידוע הנסמך ולא הסומך: "בית הספר" (ולא "הבית ספר"), "איש העסקים" (ולא "האיש עסקים"), "בעל העסק" (ולא "הבעל עסק").
6. הגהה כירורגית ואפס שגיאות כתיב: "השכלה" (בש' שמאלית ולא ס'), "כירורגית" (ב-ת'), "אסטרטגית" (ב-ת').`;
  }

  /**
   * Return canonical bibliography metadata
   */
  getBibliography() {
    return this.canonicalBooks;
  }
}

module.exports = new HebrewLinguisticsEngine();
