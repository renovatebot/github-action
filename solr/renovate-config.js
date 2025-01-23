module.exports = {
  gitAuthor: 'SolrBot <solrbot@cominvent.com>',
  onboarding: false,
  requireConfig: "required",
  platform: 'github',
  forkProcessing: "disabled",
  repositories: [
    'apache/solr'
  ],
  // Do independent upgrades for main and branch_9x. See renovate.json overlay file on branch_9x
  baseBranches: ["main", "branch_9x"],
  useBaseBranchConfig: "merge",
  allowedPostUpgradeCommands: ["./gradlew.*"]
};
