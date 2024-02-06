// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // css: [
  //   'vuetify/styles/main.sass',
  //   '@mdi/font/css/materialdesignicons.min.css',
  // ],
  // build: {
  //   transpile: ['vuetify'],
  // },
  runtimeConfig: {
    authSecret: '', // can be overridden by NUXT_AUTH_SECRET environment variable
    githubId: '',
    githubSecret: '',
    googleId: '',
    googleSecret: '',
    authOrigin: '',
  },
  devtools: { enabled: true },

  modules: [
    // Simple usage
    '@sidebase/nuxt-auth',
    '@nuxtjs/eslint-module',
    'nuxt3-leaflet',
    '@nuxtjs/cloudinary',
    'nuxt-quasar-ui',
    [
      '@nuxtjs/i18n',
      {
        lazy: true,
        langDir: 'locales',
        strategy: 'prefix_except_default',
        locales: [
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
        ],
        defaultLocale: 'en',
      },
    ],
  ],
  imports: { dirs: ['stores'] },
  quasar: {
    extras: {
      font: 'roboto-font',
      fontIcons: ['material-icons', 'mdi-v6'],
    },
  },
  typescript: {
    shim: false,
  },
});
