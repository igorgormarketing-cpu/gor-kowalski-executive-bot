/**
 * ==========================================================================
 * GOR MARKETING - TWIN PROJECT B SUPABASE REALTIME SERVICE REQUEST WATCHER
 * ==========================================================================
 * Listens in Realtime to service_requests (project_id='project_b', status='open')
 * Automatically sends WhatsApp notifications to assigned suppliers with direct
 * click-to-chat links to the building committee/resident, then updates status to 'assigned'.
 */
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const config = require('../config');

class TwinProjectBWatcher {
  constructor() {
    this.supabaseUrl = process.env.SUPABASE_URL || 'https://klybtifgqntztzinbvbr.supabase.co';
    this.supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || '';
    this.supabase = null;
    this.sock = null;
    this.channel = null;
  }

  init(sockInstance) {
    this.sock = sockInstance;

    if (!this.supabaseServiceKey) {
      console.log('⚠️ [TWIN Project B Watcher] SUPABASE_SERVICE_ROLE_KEY not set yet. Waiting for key configuration.');
      return;
    }

    try {
      this.supabase = createClient(this.supabaseUrl, this.supabaseServiceKey, {
        auth: { persistSession: false }
      });

      console.log('🔌 [TWIN Project B Watcher] Connected to Supabase Realtime.');
      this.startListening();
    } catch (err) {
      console.error('❌ [TWIN Watcher Init Error]', err.message);
    }
  }

  startListening() {
    if (!this.supabase) return;

    this.channel = this.supabase
      .channel('twin_project_b_service_requests')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'service_requests',
          filter: 'project_id=eq.project_b'
        },
        async (payload) => {
          console.log('🔔 [TWIN Project B Realtime Event]', payload);
          const newRequest = payload.new;
          if (newRequest && (newRequest.status === 'open' || !newRequest.status)) {
            await this.handleNewServiceRequest(newRequest);
          }
        }
      )
      .subscribe((status) => {
        console.log(`📡 [TWIN Watcher Subscription Status]: ${status}`);
      });
  }

  async handleNewServiceRequest(req) {
    console.log(`🛠️ [Processing Project B Request ID: ${req.id}] Category: ${req.category}`);

    const supplierPhone = req.supplier_phone ? this.formatPhoneNumber(req.supplier_phone) : null;
    const customerPhone = req.customer_phone ? this.formatPhoneNumber(req.customer_phone) : '';
    const cleanCustomerPhone = customerPhone.replace(/\D/g, '');

    const customerName = req.customer_name || 'נציג ועד הבית';
    const supplierName = req.supplier_name || 'בעל מקצוע';
    const buildingAddress = req.building_address || 'בניין בפרויקט ב';
    const description = req.description || 'ללא פירוט';
    const category = req.category || 'כללי';
    const urgency = req.urgency === 'urgent' ? 'דחופה ⚠️' : 'רגילה';

    const waLink = `https://wa.me/${cleanCustomerPhone}?text=${encodeURIComponent(`היי ${customerName}, קיבלתי את קריאת השירות ממערכת TWIN לגבי: "${description}". מתי נוח שאתאם הגעה?`)}`;

    const supplierMessage = `🛠️ *קריאת שירות חדשה — TWIN PROJECT (פרויקט ב')*
שלום ${supplierName}, נפתחה קריאת שירות חדשה בבניין שבאחריותך:

🏢 *בניין:* ${buildingAddress}
🔧 *תחום:* ${category}
📝 *תיאור התקלה:* ${description}
🚨 *דחיפות:* ${urgency}

👤 *איש קשר (המזמין):* ${customerName}
📞 *טלפון:* ${req.customer_phone || customerPhone}

💬 *ליצירת קשר ישיר בוואטסאפ עם המזמין לתזמון הגעה:*
👉 ${waLink}

✅ *לאישור קבלת הקריאה השב להודעה זו: "מאושר"*`;

    try {
      // 1. Send WhatsApp directly to the supplier
      if (supplierPhone && this.sock) {
        const targetJid = `${supplierPhone}@s.whatsapp.net`;
        console.log(`📤 [TWIN Watcher] Sending WhatsApp alert to Supplier: ${targetJid}`);
        await this.sock.sendMessage(targetJid, { text: supplierMessage });
      }

      // 2. Send notification to Founder (Igor)
      if (this.sock) {
        const ownerJid = `${config.FOUNDER_PHONE}@s.whatsapp.net`;
        const ownerAlert = `📢 *[התראת TWIN — פרויקט ב']*
נפתחה קריאת שירות חדשה ב-${buildingAddress} (${category}).
הועבר בוואטסאפ לבעל המקצוע: ${supplierName} (${req.supplier_phone || 'ללא טלפון'}).`;
        await this.sock.sendMessage(ownerJid, { text: ownerAlert });
      }

      // 3. Update Supabase status to 'assigned'
      if (this.supabase && req.id) {
        const { error } = await this.supabase
          .from('service_requests')
          .update({
            status: 'assigned',
            assigned_at: new Date().toISOString()
          })
          .eq('id', req.id);

        if (error) {
          console.error('[TWIN Watcher Status Update Error]', error.message);
        } else {
          console.log(`✅ [TWIN Watcher] Request ${req.id} updated to 'assigned' in Supabase.`);
        }
      }
    } catch (err) {
      console.error('[TWIN Watcher Execution Error]', err.message);
    }
  }

  formatPhoneNumber(phone) {
    if (!phone) return '';
    let p = phone.replace(/\D/g, '');
    if (p.startsWith('0')) {
      p = '972' + p.substring(1);
    }
    return p;
  }
}

module.exports = new TwinProjectBWatcher();
