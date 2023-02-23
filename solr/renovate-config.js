module.exports = {
  gitAuthor: 'SolrBot <solrbot@cominvent.com>',
  onboarding: false,
  requireConfig: "required",
  platform: 'github',
  includeForks: false,
  repositories: [
    'apache/solr',
    'cominvent/solr-playground'
  ],
  allowedPostUpgradeCommands: ["./gradlew.*"]
};
