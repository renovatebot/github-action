module.exports = {
  '*.{ts,tsx,js,jsx,json}': ['npm run lint-es:file:fix'],
  '*.{vue,ts,css,less,scss,html,htm,md,markdown,yml,yaml}': [
    'npm run format:file',
  ],
};
