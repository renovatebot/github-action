module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier', 'json'],
  parserOptions: {
    sourceType: 'module',
  },
  env: {
    es2020: true,
    node: true,
  },
  rules: {
    'prettier/prettier': 'error',
    'sort-imports': 'error',
  },
  ignorePatterns: [
    '.git/',
    '.vscode',
    'build/',
    'dist/',
    'coverage/',
    'LICENSE.md',
    'modules/',
    'node_modules/',
    '!.*',
  ],
};
