const axios = require('axios');

class WebSearchService {
  async search(query) {
    try {
      // Clean query and search using DuckDuckGo HTML / Rapid Search or Google Grounding
      const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
      const resp = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        },
        timeout: 10000
      });

      const text = resp.data;
      const matches = [...text.matchAll(/<a class="result__snippet[^>]*>([\s\S]*?)<\/a>/g)].map(m => m[1].replace(/<[^>]+>/g, '').trim());
      const titleMatches = [...text.matchAll(/<a class="result__url[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g)].map(m => ({ url: m[1], title: m[2].replace(/<[^>]+>/g, '').trim() }));

      const results = matches.slice(0, 5).map((snippet, idx) => {
        return {
          title: titleMatches[idx]?.title || 'Result',
          url: titleMatches[idx]?.url || '',
          snippet
        };
      });

      if (results.length === 0) {
        return { query, summary: 'לא נמצאו תוצאות ישירות, חיפוש אלטרנטיבי מבוסס מנוע AI פעיל.' };
      }

      return { query, results };
    } catch(e) {
      console.warn('[WebSearch] Fallback to AI knowledge:', e.message);
      return { query, fallback: true, error: e.message };
    }
  }

  async searchEventsAndPlaces(category, location = 'ישראל') {
    const q = `${category} ${location} המלצות מחירי כרטיסים הזמנות 2026`;
    return await this.search(q);
  }
}

module.exports = new WebSearchService();