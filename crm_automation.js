/**
 * ==========================================================================
 * GOR MARKETING - CRM AUTOMATION & FOLLOW-UP HUB
 * ==========================================================================
 */
const persistentMemory = require('./persistent_memory');

class CrmAutomation {
  logNewProposal({ clientName, clientPhone, scope, price, docxPath, pdfPath }) {
    const dealId = `DEAL-${Date.now()}`;
    const deal = {
      dealId,
      clientName: clientName || 'לקוח ללא שם',
      clientPhone: clientPhone || 'Unknown',
      scope: scope || 'פרויקט דיגיטל ושיווק',
      price: price || '5,000',
      status: 'PROPOSAL_SENT',
      createdAt: new Date().toISOString(),
      followUpDue: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
      docxPath,
      pdfPath
    };

    persistentMemory.saveClientProfile(clientPhone, {
      lastDeal: deal,
      name: clientName
    });

    console.log(`📊 [CRM Automation] Logged Proposal: ${dealId} for ${clientName} (${price} ₪)`);
    return deal;
  }

  getPendingFollowUps() {
    const clients = persistentMemory.memory.clients || {};
    const pending = [];
    const now = new Date();

    for (const [phone, data] of Object.entries(clients)) {
      if (data.lastDeal && data.lastDeal.status === 'PROPOSAL_SENT') {
        const dueDate = new Date(data.lastDeal.followUpDue);
        if (now >= dueDate) {
          pending.push({
            phone,
            name: data.name || phone,
            deal: data.lastDeal
          });
        }
      }
    }
    return pending;
  }

  generateFollowUpMessage(clientName, scope) {
    return `היי ${clientName || ''}, רציתי לבדוק איך הולך עם בדיקת הצעת המחיר ששלחנו עבור ${scope || 'הפרויקט'}? אם יש שאלות או דיוקים שתרצה שנעבור עליהם, אני והצוות כאן לרשותך!`;
  }
}

module.exports = new CrmAutomation();
