module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parser: 'vue-eslint-parser', // Ensures ESLint parses Vue files
  parserOptions: {
    parser: '@typescript-eslint/parser', // Specifies the parser for TypeScript
    ecmaVersion: 2020, // Allows for parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
  },
  extends: [
    '@nuxtjs/eslint-config-typescript', // Base ESLint rules for TypeScript in Nuxt projects
    'plugin:nuxt/recommended', // Recommended ESLint rules for Nuxt.js projects
    'plugin:vue/vue3-recommended', // Recommended ESLint rules for Vue 3 projects
    'plugin:@typescript-eslint/recommended', // Recommended rules from the @typescript-eslint/eslint-plugin
    'plugin:prettier/recommended', // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors
  ],
  plugins: [
    // List any ESLint plugins you need. For most configurations, the extends cover necessary plugins.
  ],
  rules: {
    'no-console': 'off', // Customize or remove based on your preferences
    'vue/multi-word-component-names': 'off', // Consider disabling or customizing this rule based on your project's naming conventions
    'prettier/prettier': [
      'error',
      {
        trailingComma: 'all',
        tabWidth: 2,
        semi: true,
        singleQuote: true,
        bracketSpacing: true,
        printWidth: 80,
      },
    ],
    // Add any additional rules you wish to enforce or override
  },
};
