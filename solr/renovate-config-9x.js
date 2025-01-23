module.exports = {
  gitAuthor: 'SolrBot <solrbot@cominvent.com>',
  onboarding: false,
  requireConfig: "required",
  platform: 'github',
  forkProcessing: "disabled",
  repositories: ['apache/solr'],
  baseBranches: ["branch_9x"],
  allowedPostUpgradeCommands: ["./gradlew.*"],
  branchPrefix: "renovate-9x/",
  commitMessageSuffix: " (branch_9x)",
  dryRun: "extract",
};
