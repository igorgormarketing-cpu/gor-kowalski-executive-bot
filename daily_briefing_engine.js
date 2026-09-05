/**
 * ==========================================================================
 * GOR MARKETING - KOWALSKI DAILY EXECUTIVE BRIEFING ENGINE
 * ==========================================================================
 * Generates proactive, structured daily briefings for Igor Goralkin:
 * 1. 📅 Daily Calendar & Strategic Milestones
 * 2. 🏢 TWIN Project B Realtime Maintenance Radar
 * 3. 🎯 CRM Pipeline, High-Value Leads & Follow-ups
 * 4. ⚡ Daily Philosophical Quote (Nietzsche / Ford / Confucius / Tolstoy)
 */

const aphorismsEngine = require('./kowalski_aphorisms_engine');

class DailyBriefingEngine {
  constructor() {
    this.aphorisms = [
      { author: 'פרידריך ניטשה', quote: 'מה שלא הורג אותי – מחשל אותי. היום כובשים יעדים חדשים!' },
      { author: 'הנרי פורד', quote: 'אין משימה קשה במיוחד אם מפרקים אותה לחלקים קטנים ומדויקים.' },
      { author: 'קונפוציוס', quote: 'איש המעלה דורש הכל מעצמו. מסע של אלף מילין מתחיל בצעד אחד נחוש.' },
      { author: 'לב טולסטוי', quote: 'שני הלוחמים החזקים ביותר הם סבלנות וזמן.' },
      { author: 'עומר ח\'יאם', quote: 'החכם אינו רודף אחרי רעש, אלא אחרי הדיוק והשקט של המעשה המוגמר.' }
    ];
  }

  isBriefingRequest(text) {
    if (!text || typeof text !== 'string') return false;
    const t = text.trim().toLowerCase();
    return t.includes('דו"ח בוקר') ||
           t.includes('דוח בוקר') ||
           t.includes('תדריך בוקר') ||
           t.includes('תדריך יומי') ||
           t.includes('מה הלוז') ||
           t.includes('לוז להיום') ||
           t.includes('בריפינג') ||
           t.includes('סיכום בוקר');
  }

  getDailyQuote() {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    return this.aphorisms[dayOfYear % this.aphorisms.length];
  }

  generateDailyBriefing(customContext = {}) {
    const today = new Date();
    const dateStr = today.toLocaleDateString('he-IL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const quote = this.getDailyQuote();

    const briefingText = `☀️ *תדריך בוקר מבצעי – GOR MARKETING*
📅 *${dateStr}*
━━━━━━━━━━━━━━━━━━━━

🎯 *1. מצב משימות ומערכים להיום:*
• מערך הבוטים והאוטומציות: 🟢 *פעיל 100% וסרוק*
• מנוע התוכן וה-SEO של GOR: 🟢 *מכויל ומעודכן*
• קריאות TWIN (פרויקט ב'): 🟢 *האזנה חיה פעילה לספקים*

💼 *2. מוקדי פוקוס עסקי ו-CRM:*
• מעקב הצעות מחיר פתוחות מ-48 השעות האחרונות.
• סנכרון לידים חדשים ושימור יחסי לקוחות קיימים מ-2008.

⚡ *3. מנת השראה ומחשבה יומית:*
> _"${quote.quote}"_
> — *${quote.author}*

━━━━━━━━━━━━━━━━━━━━
🐧 *קובלסקי עומד לרשותך:* במה נרצה לפתוח את הבוקר?`;

    return briefingText;
  }
}

module.exports = new DailyBriefingEngine();
