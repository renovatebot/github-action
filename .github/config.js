module.exports = {
  branchPrefix: 'ga-renovate/',
  dryRun: true,
  gitAuthor: 'Renovate Bot <bot@renovateapp.com>',
  logLevel: 'debug',
  onboarding: false,
  platform: 'github',
  repositories: ['renovatebot/github-action'],
  printConfig: true,
  lockFileMaintenance: {
    enabled: true,
    schedule: null,
  },
  schedule: null,
  packageRules: [
    {
      packagePattern: '.*',
      schedule: null,
    },
  ],
};
