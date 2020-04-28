module.exports = {
  branchPrefix: 'ga-renovate/',
  dryRun: true,
  gitAuthor: 'Renovate Bot <bot@renovateapp.com>',
  logLevel: 'debug',
  onboarding: false,
  platform: 'github',
  repositories: ['renovatebot/github-action'],
  printConfig: true,
  force: {
    schedule: ['at any time'],
    lockFileMaintenance: {
      enabled: true,
      schedule: ['at any time'],
    },
  },
};
