const i18next = require('i18next');
const fs = require('fs');
const path = require('path');

/** @type {import('@maizzle/framework').Config} */
module.exports = {
  inlineCSS: true,
  lang: 'en-US', // Default language
  t: i18next.t, // Make i18next translate function available in templates
  build: {
    templates: {
      source: 'src/templates',
      // Use `MAIZZLE_TEMPLATE_CODE` for language-specific destination subfolder
      destination: {
        path:
          '../server/assets/dm/' + (process.env.MAIZZLE_TEMPLATE_CODE || 'en'),
      },
    },
    assets: {
      source: 'src/images',
      destination: 'images',
    },
  },
  events: {
    beforeCreate: async (config) => {
      const fallbackLng = config.lang;

      if (process.env.MAIZZLE_TEMPLATE_LANG) {
        config.lang = process.env.MAIZZLE_TEMPLATE_LANG;
      }

      // Load translation based on iso code
      const langFilePath = path.resolve(
        __dirname,
        `../locales/${config.lang}.json`,
      );
      let translations = {};

      if (fs.existsSync(langFilePath)) {
        translations = JSON.parse(fs.readFileSync(langFilePath, 'utf-8'));
      } else {
        console.warn(
          `Translation file for "${config.lang}" not found. Using "en-US" as fallback.`,
        );
        translations = JSON.parse(
          fs.readFileSync(
            path.resolve(__dirname, '../locales/en-US.json'),
            'utf-8',
          ),
        );
      }

      // Initialize i18next with translations
      await i18next.init({
        lng: config.lang,
        fallbackLng,
        debug: false,
        resources: {
          [config.lang]: {
            translation: translations,
          },
        },
      });
    },
  },
  company: {
    url: 'https://farmliaison.vercel.app',
    email: 'info@farmliaison.com',
    phone: '+34-123-456-789',
    name: 'FarmLiaison',
    social: {
      facebook: 'https://facebook.com/farmliaison',
      instagram: 'https://instagram.com/farmliaison',
      twitter: 'https://twitter.com/farmliaison',
    },
  },
};
