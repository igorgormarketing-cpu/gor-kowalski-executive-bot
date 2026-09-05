/**
 * ==========================================================================
 * GOR MARKETING - KOWALSKI AUTONOMOUS COMMITMENT TRACKER 2.0
 * ==========================================================================
 * Silently monitors commitments made by Igor ("אשלח לך עד מחר", "נדבר ב-16:00", 
 * "הצעת מחיר ביום שלישי") to guarantee ZERO dropped balls.
 */

const fs = require('fs');
const path = require('path');

class CommitmentTracker {
  constructor() {
    this.dataFile = path.join(__dirname, '..', 'data', 'commitments.json');
    this.ensureDir();
    this.commitments = this.loadData();
  }

  ensureDir() {
    const dir = path.dirname(this.dataFile);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  loadData() {
    try {
      if (fs.existsSync(this.dataFile)) {
        const raw = fs.readFileSync(this.dataFile, 'utf8');
        return JSON.parse(raw);
      }
    } catch (e) {
      console.error('[Commitment Tracker Load Error]', e.message);
    }
    return [];
  }

  saveData() {
    try {
      fs.writeFileSync(this.dataFile, JSON.stringify(this.commitments, null, 2), 'utf8');
    } catch (e) {
      console.error('[Commitment Tracker Save Error]', e.message);
    }
  }

  /**
   * Detect commitment triggers from outgoing or incoming chat messages
   */
  detectCommitment(senderPhone, text, isSentByIgor = true) {
    if (!text || !isSentByIgor) return null;
    const t = text.trim();

    const commitmentPatterns = [
      /(?:אשלח|מוציא|מכין|אכין|אעביר|אדאג)\s+(?:לך|לכם|את\s+זה)?\s*(?:הצעת\s+מחיר|חוזה|מסמך|סקיצה|דוח|קובץ|חומרים)?\s*(?:עד|ב|מחר|היום|ביום\s+[א-ת]+|בשעה\s+[\d:]+)/i,
      /(?:אתקשר|נדבר|אחזור\s+אליך|נשוחח|אקבע|נקבע)\s+(?:מחר|היום|בעוד\s+\d+|ביום\s+[א-ת]+|בשעה\s+[\d:]+|בצהריים|בערב)/i,
      /(?:אבדוק|אברר|אטפל\s+בזה|על\s+זה)\s+(?:ואעדכן|ואחזור|עד\s+מחר|היום)/i
    ];

    const hasMatch = commitmentPatterns.some(p => p.test(t));
    if (!hasMatch) return null;

    const commitment = {
      id: `comm_${Date.now()}`,
      clientPhone: senderPhone,
      rawText: t,
      createdAt: new Date().toISOString(),
      status: 'PENDING',
      notified: false
    };

    this.commitments.push(commitment);
    this.saveData();
    console.log(`📌 [Commitment Logged] For ${senderPhone}: "${t}"`);
    return commitment;
  }

  getPendingCommitments() {
    return this.commitments.filter(c => c.status === 'PENDING');
  }

  markFulfilled(id) {
    const item = this.commitments.find(c => c.id === id || c.rawText.includes(id));
    if (item) {
      item.status = 'FULFILLED';
      item.fulfilledAt = new Date().toISOString();
      this.saveData();
      return true;
    }
    return false;
  }

  formatCommitmentsSummary() {
    const pending = this.getPendingCommitments();
    if (pending.length === 0) {
      return '📌 *מעקב התחייבויות (קובלסקי):*\nאין כרגע התחייבויות פתוחות שממתינות לביצוע. הכל מתוקתק ב-100%! 🚀';
    }

    let summary = `📌 *מעקב התחייבויות פתוחות (${pending.length}):*\n`;
    pending.forEach((c, idx) => {
      const date = new Date(c.createdAt).toLocaleDateString('he-IL');
      summary += `\n${idx + 1}. *התחייבות:* "${c.rawText}"\n   📱 יעד: ${c.clientPhone}\n   ⏱️ נרשם בתאריך: ${date}\n   🔸 סטטוס: ממתין לביצוע\n`;
    });

    summary += `\n💡 *לסימון התחייבות שבוצעה:* רשום "בוצע [טקסט ההתחייבות]"`;
    return summary;
  }
}

module.exports = new CommitmentTracker();
