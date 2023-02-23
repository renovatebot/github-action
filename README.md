# Renovate Github Action for Apache Solr

GitHub Action to run Renovate self-hosted for the Apache Solr project. 

This action configuration is forked from https://github.com/renovatebot/github-action. See README file in that project for more details.

See `.github/workflows/renovate.yml` for the workflow and `solr/` folder for custom config.

The bot will commit as user `SolrBot <solrbot@cominvent.com>`.

## Maintaining

**NOTE**: This is a volunteer community project organized by [@janhoy](https://github.com/janhoy), and not
officially run by the Apache Solr PMC. However, Solr committers can enable/disable and re-configure how and when
the project is scanned by this bot. See `dev-docs/dependency-upgrades.adoc` in the Solr project for details.

If you want to help maintain this bot, start by filing an issue or PR. Solr committers can
ask to be given direct commit access.

## Contributing to PRs filed by this bot

Some dependency upgrades will require further work in Solr before they pass tests.
The PR branches live in [a fork of the apache/solr git repository](https://github.com/solrbot/apache-_-solr), but Solr committers should be able to commit to the PR brahch.
