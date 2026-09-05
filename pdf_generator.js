/**
 * ==========================================================================
 * GOR MARKETING - LUXURY PDF PROPOSAL GENERATOR
 * ==========================================================================
 */
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

class PdfGenerator {
  async generateLuxuryPdf({ clientName, serviceScope, price, currency = '₪' }) {
    try {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([595.28, 841.89]); // A4 Size
      const { width, height } = page.getSize();

      const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

      // 1. Background Header Banner (GOR Marketing Luxury Dark Navy/Cyan)
      page.drawRectangle({
        x: 0,
        y: height - 140,
        width,
        height: 140,
        color: rgb(0.04, 0.07, 0.15) // Deep Navy
      });

      // Accent Gold/Cyan Border
      page.drawRectangle({
        x: 0,
        y: height - 144,
        width,
        height: 4,
        color: rgb(0.0, 0.8, 0.9) // Cyber Cyan
      });

      // Header Text
      page.drawText('GOR MARKETING', {
        x: 50,
        y: height - 60,
        size: 26,
        font: fontBold,
        color: rgb(1, 1, 1)
      });

      page.drawText('EXECUTIVE STRATEGY & PRICE PROPOSAL', {
        x: 50,
        y: height - 85,
        size: 11,
        font: fontRegular,
        color: rgb(0.0, 0.8, 0.9)
      });

      page.drawText(`DATE: ${new Date().toLocaleDateString('he-IL')} | REF: GOR-${Date.now().toString().slice(-6)}`, {
        x: 50,
        y: height - 110,
        size: 9,
        font: fontRegular,
        color: rgb(0.7, 0.75, 0.85)
      });

      // 2. Client Card Box
      page.drawRectangle({
        x: 50,
        y: height - 240,
        width: width - 100,
        height: 80,
        borderColor: rgb(0.85, 0.88, 0.92),
        borderWidth: 1,
        color: rgb(0.97, 0.98, 1)
      });

      page.drawText('PREPARED FOR:', {
        x: 70,
        y: height - 180,
        size: 10,
        font: fontBold,
        color: rgb(0.4, 0.45, 0.55)
      });

      page.drawText(`${clientName || 'Valued Client'}`, {
        x: 70,
        y: height - 205,
        size: 16,
        font: fontBold,
        color: rgb(0.08, 0.12, 0.22)
      });

      // 3. Service Scope Section
      page.drawText('SCOPE OF SERVICES & DELIVERABLES', {
        x: 50,
        y: height - 280,
        size: 12,
        font: fontBold,
        color: rgb(0.04, 0.07, 0.15)
      });

      page.drawRectangle({
        x: 50,
        y: height - 420,
        width: width - 100,
        height: 125,
        borderColor: rgb(0.88, 0.9, 0.94),
        borderWidth: 1,
        color: rgb(1, 1, 1)
      });

      const cleanScope = (serviceScope || 'Full Strategic Digital Growth & AI Automation Setup')
        .replace(/[\n\r]+/g, ' ')
        .substring(0, 180);

      page.drawText(`Description: ${cleanScope}`, {
        x: 70,
        y: height - 320,
        size: 10,
        font: fontRegular,
        color: rgb(0.2, 0.25, 0.35),
        maxWidth: width - 140
      });

      page.drawText('* Professional 360 Architecture & AI Infrastructure', {
        x: 70,
        y: height - 350,
        size: 9,
        font: fontRegular,
        color: rgb(0.3, 0.35, 0.45)
      });
      page.drawText('* Conversion Rate Optimization & Growth Strategy', {
        x: 70,
        y: height - 370,
        size: 9,
        font: fontRegular,
        color: rgb(0.3, 0.35, 0.45)
      });
      page.drawText('* End-to-End Executive QA & Launch Verification', {
        x: 70,
        y: height - 390,
        size: 9,
        font: fontRegular,
        color: rgb(0.3, 0.35, 0.45)
      });

      // 4. Total Investment Box (Luxury Accent)
      page.drawRectangle({
        x: 50,
        y: height - 540,
        width: width - 100,
        height: 90,
        color: rgb(0.04, 0.07, 0.15)
      });

      page.drawText('TOTAL INVESTMENT', {
        x: 70,
        y: height - 480,
        size: 11,
        font: fontBold,
        color: rgb(0.0, 0.8, 0.9)
      });

      page.drawText(`${price} ${currency} (+ VAT)`, {
        x: 70,
        y: height - 515,
        size: 24,
        font: fontBold,
        color: rgb(1, 1, 1)
      });

      // 5. Official Agency Signature Seal
      page.drawText('GOR MARKETING - FOUNDER & CEO SIGNATURE', {
        x: 50,
        y: height - 580,
        size: 9,
        font: fontBold,
        color: rgb(0.4, 0.45, 0.55)
      });

      page.drawText('Igor Goralkin | Founder & CEO (052-5155598)', {
        x: 50,
        y: height - 600,
        size: 10,
        font: fontRegular,
        color: rgb(0.1, 0.15, 0.25)
      });

      page.drawText('Official Website: https://www.gormarketing.com | Agency CRM: https://gorcrm.netlify.app/', {
        x: 50,
        y: height - 618,
        size: 8,
        font: fontRegular,
        color: rgb(0.5, 0.55, 0.65)
      });

      // Footer
      page.drawRectangle({
        x: 0,
        y: 0,
        width,
        height: 30,
        color: rgb(0.96, 0.97, 0.98)
      });

      page.drawText('CONFIDENTIAL & PROPRIETARY - GOR MARKETING (SINCE 2008/2009)', {
        x: 130,
        y: 11,
        size: 8,
        font: fontRegular,
        color: rgb(0.5, 0.55, 0.65)
      });

      const pdfBytes = await pdfDoc.save();
      const tempDir = path.join(__dirname, '..', 'temp');
      if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
      const filePath = path.join(tempDir, `הצעת_מחיר_GOR_MARKETING_${Date.now()}.pdf`);
      fs.writeFileSync(filePath, pdfBytes);

      return filePath;
    } catch (err) {
      console.error('[PdfGenerator Error]', err);
      return null;
    }
  }
}

module.exports = new PdfGenerator();
