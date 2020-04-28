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
  baseBranches: ['feat/slim-image'],
  packageRules: [
    {
      packagePattern: '.*',
      schedule: null,
      lockFileMaintenance: {
        enabled: true,
      },
    },
  ],
  force: {
    lockFileMaintenance: { enabled: true },
  },
};
