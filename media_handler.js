/**
 * ==========================================================================
 * GOR MARKETING - KOWALSKI MEDIA HANDLER (AUDIO & VISION)
 * ==========================================================================
 */
const { downloadMediaMessage } = require('@whiskeysockets/baileys');
const pino = require('pino');

class MediaHandler {
  async downloadMedia(msg) {
    try {
      const buffer = await downloadMediaMessage(
        msg,
        'buffer',
        {},
        { logger: pino({ level: 'silent' }) }
      );
      return buffer;
    } catch (err) {
      console.error('[MediaHandler Error] Could not download media:', err.message);
      return null;
    }
  }

  isAudioMessage(message) {
    if (!message) return false;
    let m = message;
    if (m.ephemeralMessage) m = m.ephemeralMessage.message;
    if (m.viewOnceMessage) m = m.viewOnceMessage.message;
    return !!(m?.audioMessage);
  }

  isImageMessage(message) {
    if (!message) return false;
    let m = message;
    if (m.ephemeralMessage) m = m.ephemeralMessage.message;
    if (m.viewOnceMessage) m = m.viewOnceMessage.message;
    return !!(m?.imageMessage);
  }

  isDocumentMessage(message) {
    if (!message) return false;
    let m = message;
    if (m.ephemeralMessage) m = m.ephemeralMessage.message;
    return !!(m?.documentMessage);
  }

  getMimeType(message) {
    if (!message) return '';
    let m = message;
    if (m.ephemeralMessage) m = m.ephemeralMessage.message;
    if (m.viewOnceMessage) m = m.viewOnceMessage.message;
    
    return m?.audioMessage?.mimetype ||
           m?.imageMessage?.mimetype ||
           m?.documentMessage?.mimetype ||
           '';
  }
}

module.exports = new MediaHandler();
