/**
 * ==========================================================================
 * GOR MARKETING - KOWALSKI AUTONOMOUS LEAD & CRM PIPELINE ENGINE
 * ==========================================================================
 * 1. Free-text Client & Lead Parser ("פתח לקוח חדש: ...")
 * 2. Automated Lead Scoring & Intent Classification (High/Mid/Low ROI)
 * 3. Proactive 48-Hour Follow-up Radar & High-Converting Follow-up Messages
 */

const fs = require('fs');
const path = require('path');

class LeadManagementEngine {
  constructor() {
    this.leadsFile = path.join(__dirname, '..', 'crm_leads.json');
    this.loadLeads();
  }

  loadLeads() {
    try {
      if (fs.existsSync(this.leadsFile)) {
        this.leads = JSON.parse(fs.readFileSync(this.leadsFile, 'utf8'));
      } else {
        this.leads = [];
      }
    } catch (e) {
      this.leads = [];
    }
  }

  saveLeads() {
    try {
      fs.writeFileSync(this.leadsFile, JSON.stringify(this.leads, null, 2), 'utf8');
    } catch (e) {
      console.error('❌ [LeadManagementEngine] Save error:', e.message);
    }
  }

  isLeadCreationCommand(text) {
    if (!text || typeof text !== 'string') return false;
    const t = text.trim().toLowerCase();
    return t.includes('פתח לקוח') ||
           t.includes('הוסף לקוח') ||
           t.includes('לקוח חדש') ||
           t.includes('ליד חדש') ||
           t.includes('רשום ליד') ||
           t.includes('הוסף ליד');
  }

  parseAndAddLead(text) {
    const raw = text.trim();
    
    // Extract Phone
    const phoneMatch = raw.match(/05\d[-]?\d{7}|05\d[-]?\d{3}[-]?\d{4}|\b\d{9,10}\b/);
    const phone = phoneMatch ? phoneMatch[0].replace(/[-]/g, '') : 'לא צוין';

    // Extract Budget
    const budgetMatch = raw.match(/(\d[\d,.]*)\s*(ש"ח|שח|₪|דולר|\$)/i) || raw.match(/(?:תקציב|בסך|על סך)\s*(\d[\d,.]*)/i);
    const budget = budgetMatch ? budgetMatch[1].replace(/,/g, '') : 'טרם הוגדר';

    // Extract Name
    let name = 'לקוח חדש';
    const nameMatch = raw.match(/(?:לקוח|ליד|עבור|שם|לכבוד)[:\s]+([א-ת\w\s]+?)(?:,|\n|טלפון|תקציב|פרויקט|מעוניין|$)/i);
    if (nameMatch && nameMatch[1]) {
      name = nameMatch[1].trim().replace(/^(חדש|פרויקט)[:\s]*/, '');
    }

    // Extract Project/Scope
    let scope = 'שירותי שיווק ודיגיטל';
    const scopeMatch = raw.match(/(?:פרויקט|מעוניין ב|תחום|עבור|נושא)[:\s]+([א-ת\w\s,]+?)(?:,|\n|תקציב|טלפון|$)/i);
    if (scopeMatch && scopeMatch[1]) {
      scope = scopeMatch[1].trim();
    }

    // Lead Scoring
    const budgetNum = parseInt(budget, 10) || 0;
    let score = '🌟 ליד סטנדרטי';
    if (budgetNum >= 10000 || raw.includes('ריטיינר') || raw.includes('שנתי')) {
      score = '💎 ליד VIP ברמת פרימיום (High ROI)';
    } else if (budgetNum >= 5000) {
      score = '🔥 ליד איכותי בעל פוטנציאל גבוה';
    }

    const leadRecord = {
      id: `lead_${Date.now()}`,
      name,
      phone,
      budget: budgetNum ? `${budgetNum.toLocaleString()} ש"ח` : budget,
      scope,
      score,
      createdAt: new Date().toISOString(),
      status: 'new'
    };

    this.leads.push(leadRecord);
    this.saveLeads();

    return {
      success: true,
      lead: leadRecord,
      formattedSummary: `✅ *הליד נקלט ונשמר בהצלחה ב-CRM של GOR!*
━━━━━━━━━━━━━━━━━━━━
👤 *שם הלקוח:* ${leadRecord.name}
📞 *טלפון:* ${leadRecord.phone}
💰 *תקציב מוערך:* ${leadRecord.budget}
🎯 *מהות הפרויקט:* ${leadRecord.scope}
🏆 *דירוג איכות:* ${leadRecord.score}
━━━━━━━━━━━━━━━━━━━━
💡 *המלצת קובלסקי:* לתאם שיחת אפיון קצרה או לשלוח הצעת מחיר ב-PDF.`
    };
  }

  getFollowUpSuggestions() {
    if (this.leads.length === 0) return 'אין כרגע לידים פתוחים הממתינים לפולו-אפ.';

    const openLeads = this.leads.filter(l => l.status === 'new').slice(-5);
    let report = `📋 *רדאר לידים ומעקב פולו-אפ (GOR CRM):*\n━━━━━━━━━━━━━━━━━━━━\n`;

    openLeads.forEach((l, idx) => {
      report += `${idx + 1}. *${l.name}* | ${l.phone} | ${l.budget}\n   מהות: ${l.scope} (${l.score})\n`;
    });

    report += `\n💬 *נוסח פולו-אפ מומלץ לוואטסאפ:*
"היי [שם], איגור מ-GOR MARKETING. רציתי לוודא שקיבלת את כל הנתונים ובדקת את כיוון הפעולה שלנו. מתי נוח שנדבר קצרות ונתקדם לשלב הבא?"`;

    return report;
  }
}

module.exports = new LeadManagementEngine();
