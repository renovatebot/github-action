module.exports = {
  gitAuthor: 'SolrBot <solrbot@cominvent.com>',
  onboarding: false,
  requireConfig: false,
  platform: 'github',
  includeForks: true,
  repositories: [
    'cominvent/renovate-test'
  ],
  allowedPostUpgradeCommands: ["./gradlew.*"],
  logFileLevel: "debug"
};
