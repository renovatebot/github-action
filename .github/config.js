module.exports = {
  branchPrefix: 'ga-renovate/',
  dryRun: true,
  gitAuthor: 'Renovate Bot <bot@renovateapp.com>',
  logLevel: 'debug',
  onboarding: false,
  platform: 'github',
  repositories: ['renovatebot/github-action'],
  lockFileMaintenance: {
    enabled: true,
    schedule: ['at any time'],
  },
  printConfig: true,
  packageRules: [
    {
      description: 'lockFileMaintenance',
      updateTypes: ['lockFileMaintenance'],
      enabled: true,
      schedule: ['at any time'],
    },
  ],
};
