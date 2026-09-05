/**
 * ==========================================================================
 * GOR MARKETING - IGOR GORALKIN DIGITAL LINGUISTIC TWIN ENGINE 2.0
 * ==========================================================================
 * Continuously learns, analyzes, and clones Igor's authentic Israeli speech style,
 * vocabulary, phrasing cadence, and warmth from live WhatsApp messages and chat exports.
 */

const fs = require('fs');
const path = require('path');

class IgorLinguisticTwin {
  constructor() {
    this.profileFile = path.join(__dirname, '..', 'data', 'igor_speech_profile.json');
    this.ensureDir();
    this.profile = this.loadProfile();
  }

  ensureDir() {
    const dir = path.dirname(this.profileFile);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  loadProfile() {
    try {
      if (fs.existsSync(this.profileFile)) {
        return JSON.parse(fs.readFileSync(this.profileFile, 'utf8'));
      }
    } catch (e) {
      console.error('[Igor Linguistic Twin Load Error]', e.message);
    }
    return {
      frequent_phrases: [
        'אחי', 'תכלס', 'נסיך שלי', 'חיים שלי', 'אהוב שלי', 'אלוף', 'לתקתק',
        'סגור', 'אש', 'בכיף', 'על העיוור', 'דוגרי', 'בוא נעיף את זה'
      ],
      sentence_cadence: 'קצר, ישיר, חם, חד, 1-2 משפטים עם אנרגיה גבוהה',
      sample_sentences: [],
      learned_samples_count: 0,
      last_updated: new Date().toISOString()
    };
  }

  saveProfile() {
    try {
      fs.writeFileSync(this.profileFile, JSON.stringify(this.profile, null, 2), 'utf8');
    } catch (e) {
      console.error('[Igor Linguistic Twin Save Error]', e.message);
    }
  }

  /**
   * Observe and learn from every message sent by Igor
   */
  learnFromIgorMessage(text) {
    if (!text || typeof text !== 'string') return;
    const clean = text.trim();
    if (clean.length < 3) return;

    // Add to sample sentences (keep last 100 representative samples)
    if (!this.profile.sample_sentences.includes(clean)) {
      this.profile.sample_sentences.unshift(clean);
      if (this.profile.sample_sentences.length > 100) {
        this.profile.sample_sentences.pop();
      }
    }

    // Extract multi-word phrases and idioms
    const words = clean.split(/\s+/);
    if (words.length >= 2) {
      for (let i = 0; i < words.length - 1; i++) {
        const bigram = `${words[i]} ${words[i + 1]}`;
        if (!this.profile.frequent_phrases.includes(bigram) && bigram.length > 5 && bigram.length < 20) {
          if (this.profile.frequent_phrases.length < 50) {
            this.profile.frequent_phrases.push(bigram);
          }
        }
      }
    }

    this.profile.learned_samples_count++;
    this.profile.last_updated = new Date().toISOString();
    this.saveProfile();
  }

  /**
   * Batch ingest an exported WhatsApp chat text file (_chat.txt)
   */
  ingestExportedChat(fileContent) {
    if (!fileContent) return { success: false, message: 'הקובץ ריק' };

    const lines = fileContent.split(/\r?\n/);
    let igorCount = 0;

    for (const line of lines) {
      // Check if line is from Igor (e.g. "12/05/2026, 14:30 - Igor Goralkin: ...")
      const match = line.match(/-\s*(?:איגור|איגור גורלקין|Igor|Igor Goralkin|\+972\s*52-?515-?5598):\s*(.+)/i);
      if (match && match[1]) {
        const msgText = match[1].trim();
        if (msgText && !msgText.includes('<מדיה הושמטה>') && !msgText.includes('<Media omitted>')) {
          this.learnFromIgorMessage(msgText);
          igorCount++;
        }
      }
    }

    return {
      success: true,
      messagesLearned: igorCount,
      totalSamples: this.profile.learned_samples_count,
      frequentPhrasesCount: this.profile.frequent_phrases.length
    };
  }

  getLinguisticPromptContext() {
    const samples = this.profile.sample_sentences.slice(0, 10).map(s => `"${s}"`).join(', ');
    const phrases = this.profile.frequent_phrases.slice(0, 15).join(', ');

    return `🗣️ [פרופיל סגנון דיבור וניסוח אותנטי של איגור גורלקין - נלמד מהודעות אמיתיות]:
- ביטויים שגורים ומילות מפתח של איגור: ${phrases}
- קצב ותבנית: ${this.profile.sentence_cadence}
- דוגמאות מייצגות לניסוחים של איגור: ${samples || 'קצר, חברי, תכלס, חם ובגובה העיניים'}`;
  }
}

module.exports = new IgorLinguisticTwin();
