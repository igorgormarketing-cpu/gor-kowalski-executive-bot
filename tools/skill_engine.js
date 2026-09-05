const fs = require('fs');
const path = require('path');
const config = require('../config');

class SkillEngine {
  constructor() {
    this.skillsDir = config.PATHS.SKILLS_DIR;
    this.memoryDir = config.PATHS.MEMORY_DIR;
  }

  getAllSkills() {
    try {
      if (!fs.existsSync(this.skillsDir)) return [];
      const files = fs.readdirSync(this.skillsDir).filter(f => f.endsWith('.md'));
      return files.map(file => {
        const content = fs.readFileSync(path.join(this.skillsDir, file), 'utf8');
        const name = file.replace('.md', '');
        return { name, file, content };
      });
    } catch(e) {
      console.error('[SkillEngine] Error reading skills:', e);
      return [];
    }
  }

  getSkillsPromptContext() {
    const skills = this.getAllSkills();
    if (skills.length === 0) return '';
    let prompt = '\n=== KOWALSKI LEARNED SKILLS & PLAYBOOKS ===\n';
    skills.forEach(s => {
      prompt += `\n--- SKILL: ${s.name} ---\n${s.content}\n`;
    });
    return prompt;
  }

  saveNewSkill(skillName, skillContent, category = 'general') {
    try {
      const sanitizedName = skillName.toLowerCase().replace(/[^a-z0-9_א-ת]/g, '_');
      const filename = `${sanitizedName}.md`;
      const filePath = path.join(this.skillsDir, filename);
      
      const formattedContent = `# סקיל: ${skillName}
**קטגוריה:** ${category}
**תאריך למידה:** ${new Date().toISOString()}

## הנחיות ביצוע (Instructions):
${skillContent}
`;

      fs.writeFileSync(filePath, formattedContent, 'utf8');
      console.log(`[SkillEngine] New skill saved: ${filename}`);
      return { success: true, skillName, filename };
    } catch(e) {
      console.error('[SkillEngine] Error saving skill:', e);
      return { success: false, error: e.message };
    }
  }

  deleteSkill(skillName) {
    try {
      const filename = skillName.endsWith('.md') ? skillName : `${skillName}.md`;
      const filePath = path.join(this.skillsDir, filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return { success: true, message: `הסקיל ${skillName} נמחק בהצלחה` };
      }
      return { success: false, error: 'הסקיל לא נמצא' };
    } catch(e) {
      return { success: false, error: e.message };
    }
  }
}

module.exports = new SkillEngine();