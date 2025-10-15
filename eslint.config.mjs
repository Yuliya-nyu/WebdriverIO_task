import js from '@eslint/js';
import globals from 'globals';
import { defineConfig } from 'eslint/config';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs}'],

    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },

    plugins: {
      js,
      prettier: prettierPlugin,
    },

    extends: ['js/recommended', prettierConfig],

    rules: {
      ...prettierPlugin.configs.recommended.rules,
      'no-unused-vars': 'warn',
      'no-undef': 'off',
      'no-dupe-keys': 'error',
      'prettier/prettier': 'error',
    },
  },
]);
