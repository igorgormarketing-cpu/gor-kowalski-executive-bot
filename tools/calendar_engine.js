/**
 * ==========================================================================
 * GOR MARKETING - KOWALSKI CALENDAR & MEETING ENGINE
 * ==========================================================================
 */
const ics = require('ics');
const fs = require('fs');
const path = require('path');

class CalendarEngine {
  parseDateTime(text) {
    const now = new Date();
    let targetDate = new Date(now);
    
    // Day offset parsing
    if (text.includes('מחר')) {
      targetDate.setDate(targetDate.getDate() + 1);
    } else if (text.includes('מחרתיים')) {
      targetDate.setDate(targetDate.getDate() + 2);
    } else if (text.includes('ראשון')) {
      targetDate = this.getNextDayOfWeek(0);
    } else if (text.includes('שני')) {
      targetDate = this.getNextDayOfWeek(1);
    } else if (text.includes('שלישי')) {
      targetDate = this.getNextDayOfWeek(2);
    } else if (text.includes('רביעי')) {
      targetDate = this.getNextDayOfWeek(3);
    } else if (text.includes('חמישי')) {
      targetDate = this.getNextDayOfWeek(4);
    } else if (text.includes('שישי')) {
      targetDate = this.getNextDayOfWeek(5);
    }

    // Hour parsing
    let hour = 11;
    let minute = 0;
    const timeMatch = text.match(/(\d{1,2})[:.](\d{2})/i) || text.match(/(?:בשעה|בשעה|ב-)\s*(\d{1,2})/i);
    if (timeMatch) {
      hour = parseInt(timeMatch[1], 10);
      if (timeMatch[2]) minute = parseInt(timeMatch[2], 10);
    }

    targetDate.setHours(hour, minute, 0, 0);
    return targetDate;
  }

  getNextDayOfWeek(dayOfWeek) {
    const today = new Date();
    const result = new Date(today);
    result.setDate(today.getDate() + ((7 + dayOfWeek - today.getDay()) % 7 || 7));
    return result;
  }

  async generateMeetingInvite({ title, clientName, dateTime, durationMinutes = 45 }) {
    const date = dateTime instanceof Date ? dateTime : new Date(dateTime);
    const startYear = date.getFullYear();
    const startMonth = date.getMonth() + 1;
    const startDay = date.getDate();
    const startHour = date.getHours();
    const startMinute = date.getMinutes();

    const meetRoomId = `gor-${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 5)}`;
    const meetUrl = `https://meet.google.com/${meetRoomId}`;

    const eventDetails = {
      start: [startYear, startMonth, startDay, startHour, startMinute],
      duration: { minutes: durationMinutes },
      title: title || `פגישת אסטרטגיה עסקית - GOR MARKETING x ${clientName || 'לקוח'}`,
      description: `פגישת ייעוץ ואסטרטגיה עסקית עם איגור גורלקין (מנכ"ל GOR MARKETING).\n\nקישור לשיחת וידאו (Google Meet):\n${meetUrl}\n\nטלפון איגור: 052-5155598\nאתר: https://www.gormarketing.com`,
      location: meetUrl,
      url: meetUrl,
      organizer: { name: 'Igor Goralkin - GOR MARKETING', email: 'igor@gormarketing.com' }
    };

    return new Promise((resolve) => {
      ics.createEvent(eventDetails, (error, value) => {
        if (error) {
          console.error('[ICS Gen Error]', error);
          resolve(null);
          return;
        }
        const tempDir = path.join(__dirname, '..', 'temp');
        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
        const filePath = path.join(tempDir, `פגישת_GOR_MARKETING_${Date.now()}.ics`);
        fs.writeFileSync(filePath, value, 'utf8');

        // Google Calendar direct web URL
        const startTimeStr = date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        const endDate = new Date(date.getTime() + durationMinutes * 60000);
        const endTimeStr = endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventDetails.title)}&dates=${startTimeStr}/${endTimeStr}&details=${encodeURIComponent(eventDetails.description)}&location=${encodeURIComponent(meetUrl)}`;

        resolve({
          icsPath: filePath,
          meetUrl,
          gcalUrl,
          formattedDate: `${date.toLocaleDateString('he-IL')} בשעה ${String(startHour).padStart(2, '0')}:${String(startMinute).padStart(2, '0')}`
        });
      });
    });
  }
}

module.exports = new CalendarEngine();
