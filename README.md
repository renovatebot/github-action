# GitHub Action Renovate

GitHub Action to run Renovate self-hosted.

<a name="toc"></a>

## Table of contents

- [Badges](#badges)
- [Options](#options)
  - [`configurationFile`](#configurationfile)
  - [`token`](#token)
- [Example](#example)
- [License](#license)

## Badges

| Badge                                                                                                                                                                                                         | Description  | Service              |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ | -------------------- |
| <a href="https://github.com/prettier/prettier#readme"><img alt="code style" src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square"></a>                                          | Code style   | Prettier             |
| <a href="https://conventionalcommits.org"><img alt="Conventional Commits: 1.0.0" src="https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg?style=flat-square"></a>                            | Commit style | Conventional Commits |
| <a href="https://renovatebot.com"><img alt="Renovate enabled" src="https://img.shields.io/badge/renovate-enabled-brightgreen.svg?style=flat-square"></a>                                                      | Dependencies | Renovate             |
| <a href="https://github.com/renovatebot/github-action/actions"><img alt="GitHub workflow status" src="https://img.shields.io/github/workflow/status/renovatebot/github-action/Build?style=flat-square"></a>   | Build        | GitHub Actions       |
| <a href="https://github.com/renovatebot/github-action/actions"><img alt="GitHub workflow status" src="https://img.shields.io/github/workflow/status/renovatebot/github-action/Example?style=flat-square"></a> | Example      | GitHub Actions       |

## Options

## `configurationFile`

Configuration file to configure Renovate. The supported configurations files can be one of the configuration files listed in the Renovate Docs for [Configuration Options](https://docs.renovatebot.com/configuration-options/) or a JavaScript file that exports a configuration object. For both of these options, an example can be found in the [example](./example) directory.

The configurations that can be done in this file consists of two parts, as listed below. Refer to the links to the [Renovate Docs](https://docs.renovatebot.com/) for all options.

1. [Self-Hosted Configuration Options](https://docs.renovatebot.com/self-hosted-configuration/)
2. [Configuration Options](https://docs.renovatebot.com/configuration-options/)

The [`branchPrefix`](https://docs.renovatebot.com/configuration-options/#branchprefix) option is important to configure and should be configured to a value other than the default to prevent interference with e.g. the Renovate GitHub App.

If you want to use this with just the single configuration file, make sure to include the following two configuration lines. This disables the requirement of a configuration file for the repository and disables onboarding.

```js
  onboarding: false,
  requireConfig: false,
```

## `token`

[Generate a personal access token](https://github.com/settings/tokens), with the `repo:public_repo` scope for only public repositories or the `repo` scope for public and private repositories, and add it to _Secrets_ (repository settings) as `RENOVATE_TOKEN`. You can also create a token without a specific scope, which gives read-only access to public repositories, for testing. This token is only used by Renovate, see the [token configuration](https://docs.renovatebot.com/self-hosted-configuration/#token), and gives it access to the repositories. The name of the secret can be anything as long as it matches the argument given to the `token` option.

Note that the [`GITHUB_TOKEN`](https://help.github.com/en/actions/configuring-and-managing-workflows/authenticating-with-the-github_token#permissions-for-the-github_token) secret can't be used for authenticating Renovate.

## Example

This example uses a personal access token and will run every 15 minutes. The personal access token is configured as a GitHub secret named `RENOVATE_TOKEN`. This example uses the [`example/config.js`](./example/config.js) file as configuration.
You can also see a live example of this action in my [github-renovate](https://github.com/vidavidorra/github-renovate) repository, which also includes a more [advanced configuration](https://github.com/vidavidorra/github-renovate/blob/master/src/config.js) for updating GitHub Action workflows.

**Remark** Update the action version to the most current, see [here](https://github.com/renovatebot/github-action/releases/latest) for latest release.

```yml
name: Renovate
on:
  schedule:
    # The "*" (#42, asterisk) character has special semantics in YAML, so this
    # string has to be quoted.
    - cron: '0/15 * * * *'
jobs:
  renovate:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v2.0.0
      - name: Self-hosted Renovate
        uses: renovatebot/github-action@v21.30.0
        with:
          configurationFile: example/renovate-config.js
          token: ${{ secrets.RENOVATE_TOKEN }}
```
