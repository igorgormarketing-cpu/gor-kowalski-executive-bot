require('dotenv').config();
const path = require('path');

module.exports = {
  AGENT_NAME: 'קובלסקי (KOWALSKI)',
  COMPANY_NAME: 'GOR MARKETING',
  FOUNDER_NAME: 'איגור גורלקין (Igor Goralkin)',
  FOUNDER_PHONE: '972525155598',
  
  OFFICIAL_WEBSITE: 'https://www.gormarketing.com',
  AGENCY_CRM: 'https://gorcrm.netlify.app/',
  OFFICIAL_EMAIL: 'igor@gormarketing.com',
  BACKUP_EMAIL: 'igorgor.marketing@gmail.com',
  GMB_LINK: 'https://share.google/1yfqsihbng2PGnXTg',
  WHATSAPP_HANDOVER: 'https://wa.me/972525155598?text=%D7%94%D7%99%D7%99%20%D7%90%D7%99%D7%92%D7%95%D7%A8%2C%20%D7%94%D7%92%D7%A2%D7%AA%D7%99%20%D7%9E%D7%A7%D7%95%D7%91%D7%9C%D7%A1%D7%A7%D7%99%20%D7%95%D7%90%D7%A9%D7%9E%D7%97%20%D7%9C%D7%93%D7%91%D7%A8%20%D7%90%D7%99%D7%AA%D7%9A',
  
  SUPPORTED_LANGUAGES: ['he', 'ru', 'en', 'ar', 'fr'],
  DEFAULT_LANGUAGE: 'he',

  MORNING_BRIEF_CRON: '30 8 * * *',
  EVENING_BRIEF_CRON: '0 19 * * *',

  NAME_VARIANTS: [
    'קובלסקי', 'קבלסקי', 'קאבלסקי', 'קאבולסקי', 'קובאלסקי',
    'כוולסקי', 'כובלסקי', 'קוולסקי', 'קוברסקי',
    'kowalski', 'kovalski', 'kobalski', 'ковальски', 'ковальский'
  ],

  ACTIVATION_PHRASES: [
    'אתה כאן', 'אתה פה', 'אתה איתנו', 'שומע אותי', 'שומע אותנו',
    'צריכים אותך', 'צריך אותך', 'בוא לשיחה', 'כנס לשיחה'
  ],

  PATHS: {
    ROOT: __dirname,
    SKILLS_DIR: path.join(__dirname, 'skills'),
    DOCS_DIR: path.join(__dirname, 'generated_docs'),
    MEMORY_DIR: path.join(__dirname, 'memory'),
    AUTH_DIR: path.join(__dirname, 'auth_session'),
    TEMP_DIR: path.join(__dirname, 'temp')
  },

  GEMINI_API_KEY: process.env.GEMINI_API_KEY || 'AIzaSyCi737y1NejDeK-CgvxuvXXrucsmgoyuE8'
};
