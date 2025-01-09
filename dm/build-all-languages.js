const { exec } = require('child_process');

const locales = [
  {
    code: 'en',
    iso: 'en-US',
    file: 'en-US.json',
    name: 'English',
  },
  {
    code: 'es',
    iso: 'es-ES',
    file: 'es-ES.json',
    name: 'Spanish',
  },
  {
    code: 'de',
    iso: 'de-DE',
    file: 'de-DE.json',
    name: 'German',
  },
  {
    code: 'fr',
    iso: 'fr-FR',
    file: 'fr-FR.json',
    name: 'French',
  },
  {
    code: 'it',
    iso: 'it-IT',
    file: 'it-IT.json',
    name: 'Italian',
  },
  {
    code: 'tr',
    iso: 'tr-TR',
    file: 'tr-TR.json',
    name: 'Turkish',
  },
  {
    code: 'ru',
    iso: 'ru-RU',
    file: 'ru-RU.json',
    name: 'Russian',
  },
];

locales.forEach((locale) => {
  console.log(`Building templates for language: ${locale.name}...`);

  exec(
    `MAIZZLE_TEMPLATE_LANG=${locale.iso} MAIZZLE_TEMPLATE_CODE=${locale.code} npx maizzle build production`,
    (error, stdout, stderr) => {
      if (error) {
        console.error(`Error building for ${locale.name}: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`Build stderr for ${locale.name}: ${stderr}`);
        return;
      }
      console.log(
        `Successfully built templates for ${locale.name}:\n${stdout}`,
      );
    },
  );
});
