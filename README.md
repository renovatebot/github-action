# GitHub Action Renovate

GitHub Action to run Renovate self-hosted.

<!-- markdownlint-disable no-inline-html -->

<a name="toc"></a>

## Table of contents

- [Badges](#badges)
- [Options](#options)
  - [`configurationFile`](#configurationfile)
  - [`token`](#token)
  - [`renovate-version`](#renovate-version)
  - [`useSlim`](#useslim)
- [Example](#example)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)
  - [Debug Logging](#debug-logging)
  - [Special token requirements when using the `github-actions` manager](#special-token-requirements-when-using-the-github-actions-manager)

## Badges

| Badge                                                                                                                                                                                                                   | Description  | Service              |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ | -------------------- |
| <a href="https://github.com/prettier/prettier#readme"><img alt="code style" src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square"></a>                                                    | Code style   | Prettier             |
| <a href="https://conventionalcommits.org"><img alt="Conventional Commits: 1.0.0" src="https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg?style=flat-square"></a>                                      | Commit style | Conventional Commits |
| <a href="https://renovatebot.com"><img alt="Renovate enabled" src="https://img.shields.io/badge/renovate-enabled-brightgreen.svg?style=flat-square"></a>                                                                | Dependencies | Renovate             |
| <a href="https://github.com/renovatebot/github-action/actions"><img alt="GitHub workflow status" src="https://img.shields.io/github/actions/workflow/status/renovatebot/github-action/build.yml?style=flat-square"></a> | Build        | GitHub Actions       |

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

Note that the [`GITHUB_TOKEN`](https://help.github.com/en/actions/configuring-and-managing-workflows/authenticating-with-the-github_token#permissions-for-the-github_token) secret can't be used for authenticating Renovate because it has too restrictive permissions. In particular, using the `GITHUB_TOKEN` to create a new `Pull Request` from more types of Github Workflows results in `Pull Requests` that [do not trigger your `Pull Request` and `Push` CI events](https://docs.github.com/en/actions/security-guides/automatic-token-authentication#using-the-github_token-in-a-workflow).

If you want to use the `github-actions` manager, you must setup a [special token](#special-token-requirements-when-using-the-github-actions-manager) with some requirements.

## `renovate-version`

The Renovate version to use.
If omited and `useSlim !== false` the action will use the `slim` docker tag and the `latest` tag otherwise.
If a version is definded, the action will add `-slim` suffix to the tag if `useSlim !== false`.
Checkout docker hub for available [tag](https://hub.docker.com/r/renovate/renovate/tags).

This sample will use `renovate/renovate:35.0.0-slim` image.

```yml
....
jobs:
  renovate:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3.3.0
      - name: Self-hosted Renovate
        uses: renovatebot/github-action@v36.0.0
        with:
          renovate-version: 35.0.0
          token: ${{ secrets.RENOVATE_TOKEN }}
```

This sample will use `renovate/renovate:latest` image.

```yml
....
jobs:
  renovate:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3.3.0
      - name: Self-hosted Renovate
        uses: renovatebot/github-action@v36.0.0
        with:
          useSlim: false
          token: ${{ secrets.RENOVATE_TOKEN }}
```

## `useSlim`

If set to `false` the action will use the full renovate image instead of the slim image.

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
        uses: actions/checkout@v3.3.0
      - name: Self-hosted Renovate
        uses: renovatebot/github-action@v34.82.0
        with:
          configurationFile: example/renovate-config.js
          token: ${{ secrets.RENOVATE_TOKEN }}
```

### Example with GitHub App

Instead of using a Personal Access Token (PAT) that is tied to a particular user you can use a [GitHub App](https://docs.github.com/en/developers/apps/building-github-apps) where permissions can be even better tuned. [Create a new app](https://docs.github.com/en/developers/apps/creating-a-github-app) and configure the app permissions and your `config.js` as described in the [Renovate documentation](https://docs.renovatebot.com/modules/platform/github/#running-as-a-github-app).

Generate and download a new private key for the app, adding the contents of the downloaded `.pem` file to _Secrets_ (repository settings) with the name `private_key` and app ID as a secret with name `app_id`.

Adjust your Renovate configuration file to specify the username of your bot.

Going forward we will be using the [tibdex/github-app-token](https://github.com/tibdex/github-app-token) action in order to exchange the GitHub App certificate for an access token that renovate can use.

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
        uses: tibdex/github-app-token@v1
        with:
          private_key: ${{ secrets.private_key }}
          app_id: ${{ secrets.app_id }}

      - name: Checkout
        uses: actions/checkout@v3.3.0

      - name: Self-hosted Renovate
        uses: renovatebot/github-action@v34.82.0
        with:
          configurationFile: example/renovate-config.js
          token: '${{ steps.get_token.outputs.token }}'
```

## Environment Variables

If you wish to pass through environment variables through to the Docker Run that powers this action you need to prefix the environment variable with `RENOVATE_`.

For example if you wish to pass through some credentials for a [host rule](https://docs.renovatebot.com/configuration-options/#hostrules) to the `config.js` then you should do so like this.

1. In your workflow pass in the environment variable

```yml
....
jobs:
  renovate:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3.3.0
      - name: Self-hosted Renovate
        uses: renovatebot/github-action@v34.82.0
        with:
          configurationFile: example/renovate-config.js
          token: ${{ secrets.RENOVATE_TOKEN }}
        env:
          RENOVATE_TFE_TOKEN: ${{ secrets.MY_TFE_TOKEN }}
```

2. In `example/renovate-config.js` include the hostRules block

```js
module.exports = {
  hostRules: [
    {
      hostType: 'terraform-module',
      matchHost: 'app.terraform.io',
      token: process.env.RENOVATE_TFE_TOKEN,
    },
  ],
};
```

### Passing other environment variables

If you want to pass other variables to the Docker container use the `env-regex` input to override the regular expression that is used to allow environment variables.

In your workflow pass the environment variable and whitelist it by specifying the `env-regex`:

```yml
....
jobs:
  renovate:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3.3.0
      - name: Self-hosted Renovate
        uses: renovatebot/github-action@v34.82.0
        with:
          configurationFile: example/renovate-config.js
          token: ${{ secrets.RENOVATE_TOKEN }}
          env-regex: "^(?:RENOVATE_\\w+|LOG_LEVEL|GITHUB_COM_TOKEN|NODE_OPTIONS|AWS_TOKEN)$"
        env:
          AWS_TOKEN: ${{ secrets.AWS_TOKEN }}
```

## Troubleshooting

### Debug logging

In case of issues, it's always a good idea to enable debug logging first.
To enable debug logging, add the environment variable `LOG_LEVEL: 'debug'` to the action:

```yml
- name: Self-hosted Renovate
  uses: renovatebot/github-action@v34.82.0
  with:
    configurationFile: example/renovate-config.js
    token: ${{ secrets.RENOVATE_TOKEN }}
  env:
    LOG_LEVEL: 'debug'
```

### Special token requirements when using the `github-actions` manager

If you want to use the `github-actions` [manager](https://docs.renovatebot.com/modules/manager/github-actions/) in Renovate, ensure that the `token` you provide contains the `workflow` scope.
Otherwise, GitHub does not allow Renovate to update worklow files and therefore it will be unable to create update PRs for affected packages (like `actions/checkout` or `renovatebot/github-action` itself).
