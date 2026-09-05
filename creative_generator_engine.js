/**
 * ==========================================================================
 * GOR MARKETING - KOWALSKI AD CREATIVE & VISUAL MARKETING ENGINE
 * ==========================================================================
 * Generates high-converting A/B/C ad variations, viral hooks, visual prompts,
 * and complete ad copy for Facebook, Instagram, Google, and LinkedIn.
 */

class CreativeGeneratorEngine {
  isCreativeRequest(text) {
    if (!text || typeof text !== 'string') return false;
    const t = text.trim().toLowerCase();
    return t.includes('תייצר מודעה') ||
           t.includes('תכין מודעה') ||
           t.includes('קריאייטיב') ||
           t.includes('מודעת פייסבוק') ||
           t.includes('מודעה לאינסטגרם') ||
           t.includes('מודעה ללינקדאין') ||
           t.includes('פוסט שיווקי') ||
           t.includes('רעיון למודעה');
  }

  generateAdPackage(topic) {
    const cleanTopic = (topic || 'שירותי שיווק וקידום דיגיטלי מתקדם').replace(/^(תייצר מודעה|תכין מודעה|קריאייטיב ל|מודעה ל)[:\s]*/i, '').trim();

    return `🎨 *חבילת קריאייטיב ומודעות ממירות – GOR MARKETING*
🎯 *נושא הקמפיין:* ${cleanTopic}
━━━━━━━━━━━━━━━━━━━━

📌 *וריאציה א' (זווית סמכות וניתוץ מיתוסים):*
🔥 *כותרת (Hook):* "למה רוב העסקים שורפים תקציבי פרסום – ואיך להפוך כל שקל להכנסה מוכחת?"
📝 *גוף המודעה:*
"בעולם שבו כולם מבטיחים 'חשיפה' ו'לייקים', אנחנו ב-GOR MARKETING מתמקדים בדבר היחיד שקובע: שורת הרווח שלך.
מ-2008 אנחנו בונים מערכות שיווק, קידום אורגני ואוטומציות AI שמביאות לקוחות משלמים, בלי בזבוז זמן ובלי תירוצים."
🚀 *קריאה לפעולה (CTA):* לחצו כאן לשיחת אפיון ממוקדת: https://wa.me/972525155598

━━━━━━━━━━━━━━━━━━━━

📌 *וריאציה ב' (זווית פסיכולוגית וכאב עסקי - כריס ווס ודייל קרנגי):*
🔥 *כותרת (Hook):* "נמאס לכם לרדוף אחרי לידים קרים שלא עונים לטלפון?"
📝 *גוף המודעה:*
"הבעיה היא לא המוצר שלכם – הבעיה היא המשפך. 
כאשר המערכת מסננת, מחממת ומכשירה את הלקוח עוד לפני השיחה הראשונה, אחוזי הסגירה שלכם מזנקים פי שלושה.
תנו למערכות הדיגיטל שלנו לעבוד בשבילכם 24/7."
🚀 *קריאה לפעולה (CTA):* בדקו עכשיו התאמה לפרויקט: https://www.gormarketing.com

━━━━━━━━━━━━━━━━━━━━

🖼️ *הנחיה ויזואלית לקריאייטיב (AI Visual Prompt):*
> \`A sleek, ultra-premium modern 3D marketing dashboard with glowing neon cyan and gold analytical charts, clean dark mode glassmorphism UI, a confident business leader reviewing explosive ROI growth metrics, high-end commercial aesthetic, 8K resolution, photorealistic.\`

💡 *קובלסקי ממליץ:* להריץ קמפיין A/B טסטינג בין שתי הווריאציות ולבחון איזה Hook מביא עלות לליד (CPL) נמוכה יותר.`;
  }
}

module.exports = new CreativeGeneratorEngine();
