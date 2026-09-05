/**
 * ==========================================================================
 * GOR MARKETING - KOWALSKI PERSISTENT LONG-TERM MEMORY & LEARNING ENGINE 2.0
 * ==========================================================================
 */
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const MEMORY_FILE = path.join(DATA_DIR, 'kowalski_memory.json');

class PersistentMemory {
  constructor() {
    this.memory = {
      chats: {},
      clients: {},
      skills: {
        tony_unanswered_10min: {
          name: 'מענה פרואקטיבי לטוני',
          rule: 'אם טוני רושם או מתקשר ואיגור לא עונה במהלך 10 דקות, קובלסקי נכנס עצמאית לשיחה, שואל במה אפשר לעזור ומסייע לו בחום ובסבלנות.',
          enabled: true
        }
      },
      learned_prompts: {
        sales_and_closing: [],
        high_language_templates: [],
        street_slang_rules: [],
        humor_and_wit: [],
        custom_instructions: []
      },
      preferences: {
        founderName: 'איגור גורלקין',
        founderPhone: '0525155598',
        agency: 'GOR MARKETING',
        foundedYear: '2008/2009',
        crmUrl: 'https://gorcrm.netlify.app/',
        activeProjects: []
      },
      knowledgeItems: []
    };
    this.isDirty = false;
    this.init();
  }

  init() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(MEMORY_FILE)) {
        const raw = fs.readFileSync(MEMORY_FILE, 'utf8');
        if (raw && raw.trim()) {
          const parsed = JSON.parse(raw);
          this.memory = {
            ...this.memory,
            ...parsed,
            skills: {
              ...(parsed.skills || {}),
              tony_unanswered_10min: {
                name: 'מענה פרואקטיבי לטוני',
                rule: 'אם טוני רושם או מתקשר ואיגור לא עונה במהלך 10 דקות, קובלסקי נכנס עצמאית לשיחה, שואל במה אפשר לעזור ומסייע לו בחום ובסבלנות.',
                enabled: true
              }
            },
            learned_prompts: {
              sales_and_closing: parsed.learned_prompts?.sales_and_closing || [],
              high_language_templates: parsed.learned_prompts?.high_language_templates || [],
              street_slang_rules: parsed.learned_prompts?.street_slang_rules || [],
              humor_and_wit: parsed.learned_prompts?.humor_and_wit || [],
              custom_instructions: parsed.learned_prompts?.custom_instructions || []
            }
          };
          console.log('🧠 [Persistent Memory] Loaded successfully from disk with prompt learning bank.');
        }
      } else {
        this.saveNow();
      }
    } catch (err) {
      console.error('[Persistent Memory Init Error]', err.message);
    }

    // Auto-save debouncer
    setInterval(() => {
      if (this.isDirty) {
        this.saveNow();
      }
    }, 4000);
  }

  saveNow() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(MEMORY_FILE, JSON.stringify(this.memory, null, 2), 'utf8');
      this.isDirty = false;
    } catch (err) {
      console.error('[Persistent Memory Save Error]', err.message);
    }
  }

  /**
   * 🎓 Teach Kowalski a new prompt or cognitive rule dynamically
   */
  learnPrompt(category, content, source = 'Igor Goralkin') {
    if (!this.memory.learned_prompts) {
      this.memory.learned_prompts = {
        sales_and_closing: [],
        high_language_templates: [],
        street_slang_rules: [],
        humor_and_wit: [],
        custom_instructions: []
      };
    }

    const targetCategory = this.memory.learned_prompts[category] ? category : 'custom_instructions';
    
    // Avoid exact duplicate
    const exists = this.memory.learned_prompts[targetCategory].some(p => p.content === content.trim());
    if (!exists) {
      this.memory.learned_prompts[targetCategory].push({
        content: content.trim(),
        source,
        addedAt: new Date().toISOString()
      });
      this.isDirty = true;
      this.saveNow();
      console.log(`🎓 [Prompt Learned] Added to ${targetCategory}: "${content.substring(0, 50)}..."`);
      return true;
    }
    return false;
  }

  /**
   * Get all learned prompts compiled for System Instruction injection
   */
  getLearnedPromptsContext() {
    if (!this.memory.learned_prompts) return '';

    const lines = [];
    const { sales_and_closing, high_language_templates, street_slang_rules, humor_and_wit, custom_instructions } = this.memory.learned_prompts;

    if (sales_and_closing?.length > 0) {
      lines.push('🎯 [פרומפטים ועקרונות מכירה וסגירה שנלמדו מאיגור]:');
      sales_and_closing.forEach((p, idx) => lines.push(`  ${idx + 1}. ${p.content}`));
    }

    if (high_language_templates?.length > 0) {
      lines.push('🏛️ [תבניות ניסוח בעברית גבוהה/משפטית שנלמדו מאיגור]:');
      high_language_templates.forEach((p, idx) => lines.push(`  ${idx + 1}. ${p.content}`));
    }

    if (street_slang_rules?.length > 0) {
      lines.push('⚡ [סלנג ישראלי וסגנון שיח דוגרי שנלמדו מאיגור]:');
      street_slang_rules.forEach((p, idx) => lines.push(`  ${idx + 1}. ${p.content}`));
    }

    if (humor_and_wit?.length > 0) {
      lines.push('😄 [סגנונות הומור ושנינות מנצחת שנלמדו מאיגור]:');
      humor_and_wit.forEach((p, idx) => lines.push(`  ${idx + 1}. ${p.content}`));
    }

    if (custom_instructions?.length > 0) {
      lines.push('💡 [הנחיות ודגשים עסקיים מיוחדים מאיגור]:');
      custom_instructions.forEach((p, idx) => lines.push(`  ${idx + 1}. ${p.content}`));
    }

    return lines.length > 0 ? `\n\n${lines.join('\n')}` : '';
  }

  addSkill(skillKey, skillData) {
    if (!this.memory.skills) this.memory.skills = {};
    this.memory.skills[skillKey] = skillData;
    this.isDirty = true;
    this.saveNow();
    console.log(`💡 [New Skill Saved] ${skillKey}:`, skillData);
  }

  getSkills() {
    return this.memory.skills || {};
  }

  getChatHistory(chatId) {
    if (!this.memory.chats[chatId]) {
      this.memory.chats[chatId] = [];
    }
    return this.memory.chats[chatId];
  }

  appendChatMessage(chatId, role, text) {
    if (!text || !text.trim()) return;
    const history = this.getChatHistory(chatId);
    history.push({
      role,
      text: text.trim(),
      timestamp: new Date().toISOString()
    });
    // Keep 40 most recent messages in persistent rolling buffer
    if (history.length > 40) {
      history.splice(0, history.length - 40);
    }
    this.isDirty = true;
  }

  clearChatHistory(chatId) {
    this.memory.chats[chatId] = [];
    this.isDirty = true;
    this.saveNow();
  }

  saveClientProfile(phone, data) {
    if (!this.memory.clients[phone]) {
      this.memory.clients[phone] = {};
    }
    this.memory.clients[phone] = {
      ...this.memory.clients[phone],
      ...data,
      updatedAt: new Date().toISOString()
    };
    this.isDirty = true;
    this.saveNow();
  }

  getClientProfile(phone) {
    return this.memory.clients[phone] || null;
  }
}

module.exports = new PersistentMemory();
