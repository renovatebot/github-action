module.exports = {
  '*.{ts,tsx,js,jsx,json}': ['yarn lint-es:file:fix'],
  '*.{js,jsx,ts,tsx,md,yml,yaml,json}': ['yarn format:file'],
};
