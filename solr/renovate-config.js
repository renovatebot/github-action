module.exports = {
  gitAuthor: 'SolrBot <solrbot@cominvent.com>',
  onboarding: false,
  requireConfig: "optional",
  platform: 'github',
  includeForks: false,
  repositories: [
    'cominvent/renovate-test'
  ],
  allowedPostUpgradeCommands: ["./gradlew.*"]
};
