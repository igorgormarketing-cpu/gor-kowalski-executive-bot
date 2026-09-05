/**
 * ==========================================================================
 * GOR MARKETING - KOWALSKI VOICE RESPONSE & AUDIO TTS ENGINE (TURBO EDITION)
 * ==========================================================================
 * Synthesizes clear, natural Hebrew speech for WhatsApp Voice Notes (PTT).
 * Optimized for ultra-low latency with parallel fetching, persistent keep-alive,
 * and high-speed in-memory audio buffer caching.
 */

const https = require('https');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Persistent Keep-Alive Agent for TTS
const ttsAgent = new https.Agent({
  keepAlive: true,
  maxSockets: 15,
  keepAliveMsecs: 60000
});

class VoiceResponseEngine {
  constructor() {
    this.audioDir = path.join(__dirname, '..', 'temp_audio');
    if (!fs.existsSync(this.audioDir)) {
      fs.mkdirSync(this.audioDir, { recursive: true });
    }
    // High-speed in-memory TTS cache
    this.audioCache = new Map();
  }

  /**
   * Clean markdown, asterisks, emojis, and symbols for natural TTS reading
   */
  cleanTextForSpeech(text) {
    if (!text || typeof text !== 'string') return '';
    return text
      .replace(/[*_~`#|>]/g, '')               // Markdown formatting
      .replace(/[\u{1F300}-\u{1F9FF}]/gu, '')  // Standard emojis
      .replace(/[\u{2600}-\u{26FF}]/gu, '')   // Miscellaneous symbols
      .replace(/[\u{2700}-\u{27BF}]/gu, '')   // Dingbats
      .replace(/🐧|🔸|🚀|🫡|💡|📌|🎙️|✅|❌|⚡/g, '') // Common bot icons
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Split long text into natural spoken sentences (max 180 chars per TTS request)
   */
  splitIntoChunks(text, maxLen = 180) {
    const clean = this.cleanTextForSpeech(text);
    if (!clean) return [];

    const sentences = clean.split(/([.!?\n]+)/).filter(Boolean);
    const chunks = [];
    let current = '';

    for (const part of sentences) {
      if ((current + part).length <= maxLen) {
        current += part;
      } else {
        if (current.trim()) chunks.push(current.trim());
        if (part.length <= maxLen) {
          current = part;
        } else {
          // Break overly long sentence by comma/space
          const words = part.split(' ');
          current = '';
          for (const word of words) {
            if ((current + ' ' + word).length <= maxLen) {
              current += (current ? ' ' : '') + word;
            } else {
              if (current.trim()) chunks.push(current.trim());
              current = word;
            }
          }
        }
      }
    }
    if (current.trim()) chunks.push(current.trim());

    return chunks.slice(0, 8); // Cap to first 8 chunks for optimal WhatsApp voice note duration
  }

  /**
   * Fetch single audio chunk from Google TTS with keep-alive agent
   */
  fetchChunkAudio(chunkText) {
    return new Promise((resolve, reject) => {
      const encoded = encodeURIComponent(chunkText);
      const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=iw&client=tw-ob&q=${encoded}`;

      https.get(url, {
        agent: ttsAgent,
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
        timeout: 5000
      }, (res) => {
        if (res.statusCode !== 200) {
          return reject(new Error(`TTS failed with status: ${res.statusCode}`));
        }
        const data = [];
        res.on('data', c => data.push(c));
        res.on('end', () => resolve(Buffer.concat(data)));
      }).on('error', reject);
    });
  }

  /**
   * Synthesize full voice note buffer (Parallel Turbo Engine)
   */
  async synthesizeVoiceNote(text) {
    const clean = this.cleanTextForSpeech(text);
    if (!clean) return null;

    // Check fast in-memory cache
    const cacheKey = crypto.createHash('md5').update(clean).digest('hex');
    if (this.audioCache.has(cacheKey)) {
      const cached = this.audioCache.get(cacheKey);
      return {
        success: true,
        buffer: cached,
        mimetype: 'audio/mp4',
        ptt: true
      };
    }

    const chunks = this.splitIntoChunks(clean);
    if (chunks.length === 0) return null;

    try {
      // Parallel fetch of all chunks simultaneously
      const promises = chunks.filter(c => c.trim()).map(c => this.fetchChunkAudio(c.trim()));
      const audioBuffers = await Promise.all(promises);

      if (audioBuffers.length === 0) return null;

      const fullBuffer = Buffer.concat(audioBuffers);
      
      // Cache the generated audio buffer
      if (this.audioCache.size > 200) {
        const firstKey = this.audioCache.keys().next().value;
        this.audioCache.delete(firstKey);
      }
      this.audioCache.set(cacheKey, fullBuffer);

      const filename = `voice_${Date.now()}.mp3`;
      const filePath = path.join(this.audioDir, filename);
      fs.writeFileSync(filePath, fullBuffer);

      return {
        success: true,
        buffer: fullBuffer,
        filePath,
        mimetype: 'audio/mpeg',
        ptt: false
      };
    } catch (err) {
      console.error('❌ [VoiceResponseEngine Turbo Error]:', err.message);
      return null;
    }
  }
}

module.exports = new VoiceResponseEngine();
