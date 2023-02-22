module.exports = {
  gitAuthor: 'SolrBot <solrbot@solr.apache.org>',
  onboarding: false,
  requireConfig: "required",
  platform: 'github',
  includeForks: false,
  repositories: [
    'apache/solr'
  ],
  allowedPostUpgradeCommands: ["./gradlew.*"]
};
