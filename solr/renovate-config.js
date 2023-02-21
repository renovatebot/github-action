module.exports = {
  gitAuthor: 'SolrBot <solrbot@cominvent.com>',
  onboarding: false,
  requireConfig: false,
  platform: 'github',
  includeForks: false,
  repositories: [
    'cominvent/renovate-test'
  ],
  allowedPostUpgradeCommands: ["./gradlew.*"]
};
