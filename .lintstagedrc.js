module.exports = {
  '*.{ts,tsx,js,jsx,json}': ['yarn lint-es:file:fix'],
  '*.{vue,ts,css,less,scss,html,htm,md,markdown,yml,yaml}': [
    'yarn format:file',
  ],
};
