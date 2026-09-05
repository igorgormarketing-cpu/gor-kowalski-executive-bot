const fs = require('fs');
const path = require('path');
const docx = require('docx');
const config = require('../config');

class DocGenerator {
  async generatePriceQuoteDocx(clientName, serviceName, price, deliverables = []) {
    const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } = docx;

    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            text: 'GOR MARKETING | הצעת מחיר רשמית',
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.RIGHT,
            bidirectional: true
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `תאריך: ${new Date().toLocaleDateString('he-IL')}\n` }),
              new TextRun({ text: `לכבוד: ${clientName}\n` }),
              new TextRun({ text: `נושא: הצעת מחיר עבור ${serviceName}\n\n`, bold: true }),
            ],
            alignment: AlignmentType.RIGHT,
            bidirectional: true
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'פירוט השירותים והתוצרים (Deliverables):\n', bold: true, size: 24 }),
              ...deliverables.map(d => new TextRun({ text: `• ${d}\n` })),
              new TextRun({ text: `\nסה"כ השקעה: ${price} ₪ (לפני מע"מ)\n\n`, bold: true, size: 26 }),
              new TextRun({ text: 'תנאי התקשרות:\n• תחילת עבודה עם אישור ההצעה ותשלום מקדמה.\n• אחריות מלאה וליווי מקצועי מבית GOR MARKETING.\n\n' }),
              new TextRun({ text: 'איגור גורלקין | מנכ"ל GOR MARKETING\nטלפון: 052-5155598 | www.gormarketing.com', bold: true })
            ],
            alignment: AlignmentType.RIGHT,
            bidirectional: true
          })
        ]
      }]
    });

    const buffer = await Packer.toBuffer(doc);
    const fileName = `הצעת_מחיר_${clientName.replace(/[^a-zA-Z0-9א-ת]/g, '_')}_${Date.now()}.docx`;
    const filePath = path.join(config.PATHS.DOCS_DIR, fileName);
    fs.writeFileSync(filePath, buffer);

    console.log('[DocGenerator] Created docx:', filePath);
    return { fileName, filePath, buffer };
  }
}

module.exports = new DocGenerator();