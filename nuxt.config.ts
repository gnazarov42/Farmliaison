// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME, // Cloudinary Cloud Name for public access, if needed
      appDomain: process.env.APP_DOMAIN,
    },
    cloudinary: {
      apiKey: process.env.CLOUDINARY_API_KEY, // Cloudinary API Key
      apiSecret: process.env.CLOUDINARY_API_SECRET, // Cloudinary API Secret
    },

    emailFrom: process.env.NUXT_EMAIL_FROM,
    mailSmtp: process.env.NUXT_MAIL_SMTP,
    mailPort: process.env.NUXT_MAIL_PORT,
    mailUsername: process.env.NUXT_MAIL_USERNAME,
    mailPassword: process.env.NUXT_MAIL_PASSWORD,
    mailTarget: process.env.NUXT_MAIL_TARGET,

    authSecret: '', // can be overridden by NUXT_AUTH_SECRET environment variable
    githubId: '',
    githubSecret: '',
    googleId: '',
    googleSecret: '',
    authOrigin: '',
  },

  devtools: { enabled: true },

  routeRules: {
    // Apply ISR to all pages except API routes
    // '/farm/**': { isr: 3600 },
    // '/api/**': { isr: false }, // Disable ISR for API routes
    '/api/**': {
      cors: true,
    },
  },
  experimental: {
    crossOriginPrefetch: true,
  },

  modules: [
    // Simple usage
    '@sidebase/nuxt-auth',
    'nuxt3-leaflet',
    '@nuxtjs/cloudinary',
    '@nuxt/image',
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
    '@nuxt/image',
    'nuxt-tiptap-editor',
    '@nuxtjs/sitemap',
  ],
  tiptap: {
    prefix: 'Tiptap', //prefix for Tiptap imports, composables not included
  },
  imports: { dirs: ['stores'] },
  image: {
    quality: 80,
    format: ['webp'],
    cloudinary: {
      baseURL: `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/`,
    },
  },
  // auth: {
  //   provider: {
  //     type: 'authjs',
  //   },
  // },
  quasar: {
    sassVariables: './css/quasar.variables.scss',
    plugins: [
      'BottomSheet',
      'Dialog',
      // 'Loading',
      // 'LoadingBar',
      'Notify',
      'Dark',
    ],
    extras: {
      font: 'roboto-font',
      fontIcons: ['material-icons', 'mdi-v6'],
    },
    components: {
      defaults: {
        QBtn: {
          unelevated: true,
          noCaps: true,
        },
      },
    },
  },
  css: ['~/css/app.scss'],
  typescript: {
    shim: false,
  },
  app: {
    head: {
      meta: [
        {
          name: 'viewport',
          content:
            'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover',
        },
      ],
    },
  },
});
