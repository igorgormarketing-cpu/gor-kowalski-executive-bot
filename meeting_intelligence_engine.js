/**
 * ==========================================================================
 * GOR MARKETING - KOWALSKI MEETING INTELLIGENCE & DEBRIEF ENGINE 2.0
 * ==========================================================================
 * 1. Pre-Meeting Intelligence: Prepares client dossier, pain points & closing strategy.
 * 2. Post-Meeting Debrief: Parses voice/text summaries, updates CRM, produces tasks & client drafts.
 */

const fs = require('fs');
const path = require('path');
const leadManagementEngine = require('./lead_management_engine');

class MeetingIntelligenceEngine {
  constructor() {
    this.meetingsDir = path.join(__dirname, '..', 'data', 'meetings');
    if (!fs.existsSync(this.meetingsDir)) {
      fs.mkdirSync(this.meetingsDir, { recursive: true });
    }
  }

  /**
   * Check if the user query is asking for pre-meeting prep
   */
  isPreMeetingRequest(text) {
    if (!text) return false;
    const t = text.toLowerCase();
    return t.includes('הכנה לפגישה') || 
           t.includes('תיק לקוח') || 
           t.includes('תכין אותי לפגישה') || 
           t.includes('מודיעין על לקוח') ||
           t.includes('מידע לפני פגישה');
  }

  /**
   * Generate Pre-Meeting Dossier for Igor
   */
  generatePreMeetingDossier(clientNameOrScope) {
    const cleanName = (clientNameOrScope || 'לקוח יקר').replace(/^(?:הכנה לפגישה עם|תיק לקוח של|תכין אותי לפגישה עם|מודיעין על)\s*/i, '').trim();

    return `🗂️ *תיק מודיעין ואסטרטגיה לקראת פגישה: ${cleanName}* 🔸

1. 🎯 *מטרת העל של הפגישה:*
   - זיהוי צוואר הבקבוק המרכזי בשיווק/מכירות של הלקוח.
   - הצגת GOR MARKETING כשותף אסטרטגי מלא ("עובד החברה הנוסף"), ולא כספק חיצוני זמני.
   - סגירת חבילת עבודה (ריטיינר חודשי / פרויקט מפתח) עם מקדמה.

2. 💡 *שאלות עומק לפתיחת השיחה (לאבחון מדויק):*
   - *"כמה לידים או עסקאות אתם סוגרים היום בחודש, וכמה אתם מסוגלים להכיל אם נכפיל את המספרים?"*
   - *"מה הניסיון שלכם עד היום עם קמפיינים ממומנים או אתרים? מה עבד ומה איכזב אתכם?"*
   - *"איפה הכי כואב לכם כרגע – בכמות הפניות, באיכות הלידים, או בסגירה בשטח?"*

3. 💼 *חבילות מומלצות להצעה מ-GOR MARKETING:*
   - 🔹 *מסלול צמיחה מלא:* אתר פרימיום מותאם המרות + קמפיין ממומן (Meta/Google) + אוטומציית CRM (8,500 ₪ + מע"מ).
   - 🔹 *מסלול ממוקד תוצאות:* ניהול קמפיינים ממומנים + דף נחיתה ומערכת מעקב לידים (5,000 ₪ + מע"מ לחודש).

4. 🛡️ *טיפ סגירה פסיכולוגי (כריס ווס / צ'אלדיני):*
   - אל תמכור תכונות (אתרים/באנרים) – מכור *שקט נפשי ושורת רווח*.
   - הדגש את הניסיון והמובילות מ-2008: אנו מביאים שיטה בדוקה, ללא ניסויי סרק על חשבון הלקוח.`;
  }

  /**
   * Check if message is a post-meeting debrief
   */
  isPostMeetingDebrief(text) {
    if (!text) return false;
    const t = text.toLowerCase();
    return t.includes('סיכום פגישה') || 
           t.includes('סיימתי פגישה') || 
           t.includes('דיברתי עם הלקוח') || 
           t.includes('סגרתי עם');
  }

  /**
   * Parse Post-Meeting Debrief (Voice or Text)
   */
  parseDebrief(text) {
    const t = text.trim();

    // Extract client name
    const clientMatch = t.match(/(?:עם|מול|של)\s+([א-ת\w\s]+?)(?:\s+(?:בסך|על סך|רוצה|ביקש|סגרנו|שרוצה|מעוניין)|$)/i);
    const clientName = clientMatch ? clientMatch[1].trim() : 'לקוח';

    // Extract price if mentioned
    const priceMatch = t.match(/(\d[\d,.]*)\s*(?:ש"ח|שח|₪|דולר|\$)/i) || t.match(/(?:סך|מחיר|ריטיינר)\s*(\d[\d,.]*)/i);
    const agreedPrice = priceMatch ? priceMatch[1] : 'לפי הצעת מחיר';

    // Auto add/update in CRM
    leadManagementEngine.parseAndAddLead(`ליד פגישה: ${clientName} - ${t}`);

    const summaryReport = `✅ *סיכום פגישה נקלט ועודכן במערכת בהצלחה!* 🔸

👤 *לקוח:* ${clientName}
💰 *סכום / היקף שצוין:* ${agreedPrice} ₪
📝 *עיקרי הדברים שתועדו:*
"${t}"

🚀 *צעדי המשך מומלצים שקובלסקי הכין:*
1. 📄 *להפקת הצעת מחיר / חוזה מידי:* רשום "תוציא הצעת מחיר ל-${clientName} על סך ${agreedPrice} שח".
2. 📱 *טיוטת הודעת וואטסאפ ללקוח:*
---
"היי ${clientName}, שמחתי מאוד להיפגש היום. אנחנו כבר בונים את תוכנית הפעולה המדויקת עבורכם ונעדכן בימים הקרובים. שיהיה המשך שבוע מצוין!"
---
3. 📅 *פולו-אפ ביומן:* עודכן מעקב ב-CRM לביצוע תוך 48 שעות.`;

    return summaryReport;
  }
}

module.exports = new MeetingIntelligenceEngine();
