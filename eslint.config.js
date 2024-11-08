/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import eslintConfigPrettier from 'eslint-config-prettier';
import globals from 'globals';
import js from '@eslint/js';
import json from 'eslint-plugin-json';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      '**/.git/',
      '**/.vscode',
      '**/build/',
      '**/dist/',
      '**/coverage/',
      '**/LICENSE.md',
      '**/modules/',
      '**/node_modules/',
      '!**/.*',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked.map((config) => ({
    ...config,
    files: ['**/*.{ts,js,mjs,cjs}'],
  })),
  ...tseslint.configs.stylisticTypeChecked.map((config) => ({
    ...config,
    files: ['**/*.{ts,js,mjs,cjs}'],
  })),
  {
    files: ['**/*.{ts,js,mjs,cjs}'],

    linterOptions: {
      reportUnusedDisableDirectives: true,
    },

    languageOptions: {
      globals: {
        ...globals.node,
      },
      ecmaVersion: 'latest',
      sourceType: 'module',

      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },

    rules: {
      'sort-imports': 'error',
    },
  },
  json.configs.recommended,
  {
    files: ['**/tsconfig.json', '**/tsconfig.*.json'],
    rules: {
      'json/*': ['error', { allowComments: true }],
    },
  },
  eslintConfigPrettier,
);
