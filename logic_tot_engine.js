/**
 * ==========================================================================
 * GOR MARKETING - TREE OF THOUGHTS (ToT) STRATEGIC REASONING ENGINE
 * ==========================================================================
 */
class LogicTotEngine {
  isStrategicQuery(text) {
    if (!text) return false;
    const lower = text.toLowerCase();
    return lower.includes('אסטרטגיה') ||
           lower.includes('איך לסגור') ||
           lower.includes('התלבטות') ||
           lower.includes('איך לתמחר') ||
           lower.includes('תרחישים') ||
           lower.includes('משא ומתן') ||
           lower.includes('ניתוח לקוח') ||
           lower.includes('מה כדאי לעשות') ||
           lower.includes('ייעוץ עסקי');
  }

  getTotPromptEnhancement(query) {
    return `[הפעלת מנוע לוגיקה עמוק - Tree of Thoughts (ToT)]:
המשימה של איגור: "${query}"

בצע ניתוח מעמיק ב-3 תרחישים מקבילים:
1. 🟢 תרחיש א' (שמרני ובטוח): גישה סולידית, מופחתת סיכון, תוצאות מיידיות.
2. 🟡 תרחיש ב' (ערך מקסימלי - מומלץ): מינוף הניסיון של GOR MARKETING (מ-2008), חבילה היברידית, ROI גבוה.
3. 🔴 תרחיש ג' (אגרסיבי / Scale): גישת פרימיום גבוהה, סקיילינג מואץ והגדלת תקציבים.

מבנה התשובה שלך:
- תמצית קצרה של המצב.
- השוואת 3 התרחישים (בנקודות קצרות וחדות).
- 🏆 *השורה התחתונה וההמלצה המבצעית של קובלסקי:* מה הצעד הראשון המדויק שאיגור צריך לבצע עכשיו.`;
  }
}

module.exports = new LogicTotEngine();
