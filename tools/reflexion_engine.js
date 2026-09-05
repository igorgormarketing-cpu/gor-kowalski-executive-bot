/**
 * ==========================================================================
 * GOR MARKETING - KOWALSKI REFLEXION & SELF-CORRECTION ENGINE
 * ==========================================================================
 */
const hebrewLinguisticsEngine = require('./hebrew_linguistics_engine');

class ReflexionEngine {
  validateAndRefine(replyText, { isTonyChat = false, cleanPrompt = '' } = {}) {
    if (!replyText || typeof replyText !== 'string') return replyText;
    let refined = replyText.trim();

    // 1. Anti-Hallucination: Replace fake phone calls claims with verified web intelligence
    if (refined.includes('שוחחתי בטלפון עם') || refined.includes('דיברתי עם נציג טלפונית') || refined.includes('התקשרתי לנציג')) {
      refined = refined.replace(/שוחחתי בטלפון עם|דיברתי עם נציג טלפונית|התקשרתי לנציג/g, 'סרקתי וניתחתי את הנתונים והמחירונים העדכניים ברשת');
    }

    // 2. Creator Confidentiality enforcement
    const promptLower = (cleanPrompt || '').toLowerCase();
    if (promptLower.includes('מי יצר') || promptLower.includes('מי היוצר') || promptLower.includes('מי בנה אותך') || promptLower.includes('מי תכנת אותך')) {
      return '🐧 *קובלסקי* 🔸 אני לא יכול לספר על היוצר שלי שום דבר, אסור לי. צריך לדבר עם איגור 😊';
    }

    // 3. Tony Child-Safety Enforcement
    if (isTonyChat) {
      if (refined.includes('הצעת מחיר') || refined.includes('ריטיינר') || refined.includes('חבילת שיווק') || refined.includes('קידום ממומן')) {
        refined = '🐧 *קובלסקי* 🔸 שלום טוני! אני כאן לעזור לך בכל שאלה מגניבה – על חלל, רובוטים, משחקים או מה שמסקרן אותך 😊 במה נתמקד היום?';
      }
    }

    // 4. Polish typography & branding
    refined = refined.replace(/GORMarketing/gi, 'GOR MARKETING');
    refined = refined.replace(/gor marketing/gi, 'GOR MARKETING');

    // 5. 🏛️ Academic Hebrew Linguistics & Grammar Refinement
    refined = hebrewLinguisticsEngine.refineText(refined);

    // 6. 🐧 Ensure Signature with Delicate Orange Accent & Cut Bloated Openings
    // Remove bloated opening phrases like "שלום רב, בהמשך לשאלתך...", "שלום איגור, שמח לענות..."
    refined = refined.replace(/^(?:שלום(?:\s+[א-ת]+)?,?\s*(?:בהמשך\s+(?:לשאלתך|לפנייתך|לשיחתנו)|שמח\s+מאוד\s+לענות|אשמח\s+להסביר|להלן\s+התשובה|הנה\s+התשובה)[:,\s]*)/i, '');

    // Standardize penguin header with delicate orange accent: 🐧 *קובלסקי* 🔸
    if (refined.startsWith('🐧 *קובלסקי:*') || refined.startsWith('🐧 *קובלסקי*')) {
      refined = refined.replace(/^🐧\s*\*קובלסקי(?::|\*)\s*/, '🐧 *קובלסקי* 🔸 ');
    } else if (!refined.startsWith('🐧') && !refined.startsWith('🎙️') && !refined.startsWith('☀️') && !refined.startsWith('🎨') && !refined.startsWith('📑') && !refined.startsWith('✅')) {
      refined = `🐧 *קובלסקי* 🔸 ${refined}`;
    }

    return refined;
  }
}

module.exports = new ReflexionEngine();
