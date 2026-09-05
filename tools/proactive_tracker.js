const fs = require('fs');
const path = require('path');
const config = require('../config');

class ProactiveTracker {
  constructor() {
    this.memoryFile = path.join(config.PATHS.MEMORY_DIR, 'commitments.json');
    this.commitments = this.loadCommitments();
  }

  loadCommitments() {
    try {
      if (fs.existsSync(this.memoryFile)) {
        return JSON.parse(fs.readFileSync(this.memoryFile, 'utf8'));
      }
    } catch(e) {}
    return [];
  }

  saveCommitments() {
    try {
      fs.writeFileSync(this.memoryFile, JSON.stringify(this.commitments, null, 2), 'utf8');
    } catch(e) {}
  }

  addCommitment(text, dueDate, clientName = '') {
    const item = {
      id: Date.now(),
      text,
      dueDate,
      clientName,
      createdAt: new Date().toISOString(),
      completed: false
    };
    this.commitments.push(item);
    this.saveCommitments();
    return item;
  }

  getPendingCommitments() {
    return this.commitments.filter(c => !c.completed);
  }

  markCompleted(id) {
    const item = this.commitments.find(c => c.id === id);
    if (item) {
      item.completed = true;
      this.saveCommitments();
      return true;
    }
    return false;
  }

  generateMorningBriefing() {
    const pending = this.getPendingCommitments();
    let brief = '🌅 *בוקר טוב איגור! תדריך הבוקר שלך מבית קובלסקי:*\n\n';
    brief += `📅 תאריך: ${new Date().toLocaleDateString('he-IL')}\n`;
    brief += `⚡ משימות ופולו-אפים פתוחים: ${pending.length}\n\n`;

    if (pending.length > 0) {
      pending.forEach((p, i) => {
        brief += `${i + 1}. ${p.text} ${p.clientName ? '(' + p.clientName + ')' : ''}\n`;
      });
    } else {
      brief += '✅ אין פולו-אפים דחופים פתוחים להיום. הכל מתוקתק!\n';
    }

    brief += '\n🎯 שיהיה יום מוצלח ומלא סגירות וצמיחה!';
    return brief;
  }
}

module.exports = new ProactiveTracker();