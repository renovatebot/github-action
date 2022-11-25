# GitHub Action Renovate

GitHub Action to run Renovate self-hosted.

<a name="toc"></a>

## Table of contents

- [Badges](#badges)
- [Options](#options)
  - [`configurationFile`](#configurationfile)
  - [`token`](#token)
- [Example](#example)
- [Troubleshooting](#troubleshooting)
  - [Debug Logging](#debug-logging)
  - [Special token requirements when using the `github-actions` manager](#special-token-requirements-when-using-the-github-actions-manager)

## Badges

| Badge                                                                                                                                                                                                         | Description  | Service              |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ | -------------------- |
| <a href="https://github.com/prettier/prettier#readme"><img alt="code style" src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square"></a>                                          | Code style   | Prettier             |
| <a href="https://conventionalcommits.org"><img alt="Conventional Commits: 1.0.0" src="https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg?style=flat-square"></a>                            | Commit style | Conventional Commits |
| <a href="https://renovatebot.com"><img alt="Renovate enabled" src="https://img.shields.io/badge/renovate-enabled-brightgreen.svg?style=flat-square"></a>                                                      | Dependencies | Renovate             |
| <a href="https://github.com/renovatebot/github-action/actions"><img alt="GitHub workflow status" src="https://img.shields.io/github/workflow/status/renovatebot/github-action/Build?style=flat-square"></a>   | Build        | GitHub Actions       |
| <a href="https://github.com/renovatebot/github-action/actions"><img alt="GitHub workflow status" src="https://img.shields.io/github/workflow/status/renovatebot/github-action/Example?style=flat-square"></a> | Example      | GitHub Actions       |

## Options

Options can be passed using the inputs of this action or the corresponding environment variables. When both are passed, the input takes precedence over the environment variable. For the available environment variables see the Renovate [Self-Hosted Configuration](https://docs.renovatebot.com/self-hosted-configuration/) docs.

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

Note that the [`GITHUB_TOKEN`](https://help.github.com/en/actions/configuring-and-managing-workflows/authenticating-with-the-github_token#permissions-for-the-github_token) secret can't be used for authenticating Renovate because it has too restrictive permissions.  In particular, using the `GITHUB_TOKEN` to create a new `Pull Request` from more types of Github Workflows results in `Pull Requests` that [do not trigger your `Pull Request` and `Push` CI events](https://docs.github.com/en/actions/security-guides/automatic-token-authentication#using-the-github_token-in-a-workflow).

If you want to use the `github-actions` manager, you must setup a [special token](#special-token-requirements-when-using-the-github-actions-manager) with some requirements.

## Example

This example uses a personal access token and will run every 15 minutes. The personal access token is configured as a GitHub secret named `RENOVATE_TOKEN`. This example uses the [`example/renovate-config.js`](./example/renovate-config.js) file as configuration.
You can also see a live example of this action in my [github-renovate](https://github.com/vidavidorra/github-renovate) repository, which also includes a more [advanced configuration](https://github.com/vidavidorra/github-renovate/blob/master/src/renovate-config.ts) for updating GitHub Action workflows.

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
        uses: renovatebot/github-action@v32.238.4
        with:
          configurationFile: example/renovate-config.js
          token: ${{ secrets.RENOVATE_TOKEN }}
```

## Example with GitHub App

Instead of using a Personal Access Token (PAT) that is tied to a particular user you can use a [GitHub App](https://docs.github.com/en/developers/apps/building-github-apps) where permissions can be even better tuned. [Create a new app](https://docs.github.com/en/developers/apps/creating-a-github-app) and configure the app permissions and your `config.js` as described in the [Renovate documentation](https://docs.renovatebot.com/modules/platform/github/#running-as-a-github-app).

Store the app ID as a secret with name `APP_ID` and generate a new private key for the app and add it as a secret to the repository as `APP_PEM` in the repository where the action will run from. Note that `APP_PEM` needs to be base64 encoded. You can encode your private key file like this from the terminal on Linux (omit the `-w 0` if you're on a Mac):

```bash
cat your_app_key.pem | base64 -w 0
```

Adjust your Renovate configuration file to specify the username of your bot.

Going forward we will be using the [machine-learning-apps/actions-app-token](https://github.com/machine-learning-apps/actions-app-token) action in order to exchange the GitHub App certificate for an access token that renovate can use.

The final workflow will look like this:

```yaml
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
      - name: Get token
        id: get_token
        uses: machine-learning-apps/actions-app-token@master
        with:
          APP_PEM: ${{ secrets.APP_PEM }}
          APP_ID: ${{ secrets.APP_ID }}

      - name: Checkout
        uses: actions/checkout@v2.0.0

      - name: Self-hosted Renovate
        uses: renovatebot/github-action@v32.238.4
        with:
          configurationFile: example/renovate-config.js
          token: 'x-access-token:${{ steps.get_token.outputs.app_token }}'
```

## Troubleshooting

### Debug logging

In case of issues, it's always a good idea to enable debug logging first.
To enable debug logging, add the environment variable `LOG_LEVEL: 'debug'` to the action:

```yml
- name: Self-hosted Renovate
  uses: renovatebot/github-action@v32.238.4
  with:
    configurationFile: example/renovate-config.js
    token: ${{ secrets.RENOVATE_TOKEN }}
  env:
    LOG_LEVEL: 'debug'
```

### Special token requirements when using the `github-actions` manager

If you want to use the `github-actions` [manager](https://docs.renovatebot.com/modules/manager/github-actions/) in Renovate, ensure that the `token` you provide contains the `workflow` scope.
Otherwise, GitHub does not allow Renovate to update worklow files and therefore it will be unable to create update PRs for affected packages (like `actions/checkout` or `renovatebot/github-action` itself).
