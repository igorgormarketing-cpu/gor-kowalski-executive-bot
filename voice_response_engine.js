/**
 * ==========================================================================
 * GOR MARKETING - KOWALSKI VOICE RESPONSE & AUDIO TTS ENGINE
 * ==========================================================================
 * Synthesizes clear, natural Hebrew speech for WhatsApp Voice Notes (PTT).
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

class VoiceResponseEngine {
  constructor() {
    this.audioDir = path.join(__dirname, '..', 'temp_audio');
    if (!fs.existsSync(this.audioDir)) {
      fs.mkdirSync(this.audioDir, { recursive: true });
    }
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
   * Fetch single audio chunk from Google TTS
   */
  fetchChunkAudio(chunkText) {
    return new Promise((resolve, reject) => {
      const encoded = encodeURIComponent(chunkText);
      const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=iw&client=tw-ob&q=${encoded}`;

      https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
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
   * Synthesize full voice note buffer
   */
  async synthesizeVoiceNote(text) {
    const chunks = this.splitIntoChunks(text);
    if (chunks.length === 0) return null;

    try {
      const audioBuffers = [];
      for (const chunk of chunks) {
        if (chunk.trim()) {
          const buf = await this.fetchChunkAudio(chunk);
          audioBuffers.push(buf);
          await new Promise(r => setTimeout(r, 150)); // Gentle throttle
        }
      }

      if (audioBuffers.length === 0) return null;

      const fullBuffer = Buffer.concat(audioBuffers);
      const filename = `voice_${Date.now()}.mp3`;
      const filePath = path.join(this.audioDir, filename);

      fs.writeFileSync(filePath, fullBuffer);

      return {
        success: true,
        buffer: fullBuffer,
        filePath,
        mimetype: 'audio/mp4', // Baileys standard for WhatsApp voice note (PTT)
        ptt: true
      };
    } catch (err) {
      console.error('❌ [VoiceResponseEngine Error]:', err.message);
      return null;
    }
  }
}

module.exports = new VoiceResponseEngine();
