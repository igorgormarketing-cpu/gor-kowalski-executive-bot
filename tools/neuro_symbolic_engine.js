/**
 * ==========================================================================
 * GOR MARKETING - NEURO-SYMBOLIC MATHEMATICAL & FINANCIAL ENGINE
 * ==========================================================================
 */
class NeuroSymbolicEngine {
  constructor() {
    this.VAT_RATE = 0.17; // 17% Israeli VAT
  }

  calculatePricing(basePriceStr) {
    const rawNum = parseFloat(String(basePriceStr).replace(/[^\d.]/g, '')) || 5000;
    const vatAmount = Math.round(rawNum * this.VAT_RATE);
    const totalPriceWithVat = Math.round(rawNum + vatAmount);

    return {
      basePrice: rawNum,
      formattedBasePrice: rawNum.toLocaleString('he-IL') + ' ₪',
      vatAmount: vatAmount.toLocaleString('he-IL') + ' ₪',
      totalWithVat: totalPriceWithVat.toLocaleString('he-IL') + ' ₪',
      summary: `${rawNum.toLocaleString('he-IL')} ₪ (+ מע"מ ${vatAmount.toLocaleString('he-IL')} ₪ = ${totalPriceWithVat.toLocaleString('he-IL')} ₪ כולל מע"מ)`
    };
  }

  calculateMediaBudgetBreakdown(totalBudget) {
    const budget = parseFloat(String(totalBudget).replace(/[^\d.]/g, '')) || 10000;
    const mediaSpend = Math.round(budget * 0.75); // 75% Direct Ad Spend
    const managementFee = Math.round(budget * 0.25); // 25% Agency Management & AI Optimization

    return {
      total: budget.toLocaleString('he-IL') + ' ₪',
      mediaSpend: mediaSpend.toLocaleString('he-IL') + ' ₪ (תקציב מדיה ישיר לגוגל/מטא)',
      managementFee: managementFee.toLocaleString('he-IL') + ' ₪ (דמי ניהול ואופטימיזציית AI)',
      projectedClicks: Math.round(mediaSpend / 4.5), // Avg CPC 4.5 NIS
      projectedLeads: Math.round((mediaSpend / 4.5) * 0.08) // Avg 8% CVR
    };
  }

  evaluateRoi(monthlyRevenueIncrease, agencyFee) {
    const revenue = parseFloat(String(monthlyRevenueIncrease).replace(/[^\d.]/g, '')) || 30000;
    const fee = parseFloat(String(agencyFee).replace(/[^\d.]/g, '')) || 6000;
    const netProfit = revenue - fee;
    const roiMultiplier = ((netProfit / fee) * 100).toFixed(0);

    return {
      monthlyFee: fee.toLocaleString('he-IL') + ' ₪',
      revenueGain: revenue.toLocaleString('he-IL') + ' ₪',
      netProfit: netProfit.toLocaleString('he-IL') + ' ₪',
      roiPercentage: `${roiMultiplier}% תשואה על ההשקעה (ROI)`
    };
  }
}

module.exports = new NeuroSymbolicEngine();
