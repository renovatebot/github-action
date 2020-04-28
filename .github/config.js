module.exports = {
  branchPrefix: 'ga-renovate/',
  dryRun: true,
  gitAuthor: 'Renovate Bot <bot@renovateapp.com>',
  logLevel: 'debug',
  onboarding: false,
  platform: 'github',
  repositories: ['renovatebot/github-action'],
  packageRules: [
    {
      description: 'lockFileMaintenance',
      updateTypes: ['lockFileMaintenance'],
      enabled: true,
      schedule: [],
    },
  ],
};
