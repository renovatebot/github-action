module.exports = {
  root: true,
  env: {
    es2020: true,
    node: true,
  },
  plugins: ['@typescript-eslint', 'json'],
  rules: {
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
  overrides: [
    {
      files: ['*.ts', '*.tsx', '*.js', '*.jsx'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 2019,
        sourceType: 'module',
        project: ['./tsconfig.eslint.json'],
      },
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'prettier',
      ],
      rules: {},
    },
    {
      files: ['*.json'],
      extends: ['plugin:json/recommended', 'prettier'],
    },
  ],
};
