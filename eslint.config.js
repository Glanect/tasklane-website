const js = require('@eslint/js');
const globals = require('globals');

module.exports = [
  {
    ignores: ['assets/**', 'node_modules/**', 'eslint.config.js'],
  },
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'script',
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
];