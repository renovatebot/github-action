module.exports = {
  gitAuthor: 'SolrBot <solrbot@cominvent.com>',
  onboarding: false,
  requireConfig: "required",
  platform: 'github',
  forkProcessing: "disabled",
  repositories: [
    'apache/solr'
  ],
  allowedPostUpgradeCommands: ["./gradlew.*"]
};
