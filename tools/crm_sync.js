const fs = require('fs');
const path = require('path');
const config = require('../config');

class CrmSyncService {
  constructor() {
    this.leadsFile = path.join(config.PATHS.MEMORY_DIR, 'leads_pipeline.json');
    this.leads = this.loadLeads();
  }

  loadLeads() {
    try {
      if (fs.existsSync(this.leadsFile)) {
        return JSON.parse(fs.readFileSync(this.leadsFile, 'utf8'));
      }
    } catch(e) {}
    return [];
  }

  saveLeads() {
    try {
      fs.writeFileSync(this.leadsFile, JSON.stringify(this.leads, null, 2), 'utf8');
    } catch(e) {}
  }

  logLead(name, phone, interest, budget = '', notes = '') {
    const lead = {
      id: Date.now(),
      name,
      phone,
      interest,
      budget,
      notes,
      source: 'WhatsApp Kowalski Bot',
      timestamp: new Date().toISOString(),
      crmUrl: config.AGENCY_CRM
    };
    this.leads.push(lead);
    this.saveLeads();
    console.log('[CrmSync] New lead logged:', name, phone);
    return lead;
  }

  getAllLeads() {
    return this.leads;
  }
}

module.exports = new CrmSyncService();