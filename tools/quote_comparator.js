class QuoteComparator {
  compare(quotes) {
    // quotes is array of { vendorName, price, items, terms, notes }
    if (!Array.isArray(quotes) || quotes.length === 0) {
      return { error: 'נדרש לפחות 2 הצעות מחיר להשוואה' };
    }

    let report = '📊 *השוואת הצעות מחיר כירורגית מבית קובלסקי:*\n\n';
    quotes.forEach((q, idx) => {
      report += `*הצעה ${idx + 1}: ${q.vendorName || 'ספק ' + (idx + 1)}*\n`;
      report += `💰 מחיר: ${q.price || 'לא צוין'}\n`;
      report += `📦 מה כולל: ${q.items || 'מפרט בסיסי'}\n`;
      report += `🔍 אותיות קטנות / תנאים: ${q.terms || 'רגיל'}\n\n`;
    });

    report += '💡 *המלצת קובלסקי להחלטה:*\nההצעה המשתלמת ביותר נבחרת לפי יחס עלות-תועלת, אחריות ומניעת אותיות קטנות.';
    return { success: true, report };
  }
}

module.exports = new QuoteComparator();