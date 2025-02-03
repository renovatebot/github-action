# GitHub Action Renovate

GitHub Action to run Renovate self-hosted.

<!-- markdownlint-disable no-inline-html -->

<a name="toc"></a>

## Table of contents

- [Badges](#badges)
- [Options](#options)
  - [`configurationFile`](#configurationfile)
  - [`docker-cmd-file`](#docker-cmd-file)
  - [`docker-network`](#docker-network)
  - [`docker-socket-host-path`](#docker-socket-host-path)
  - [`docker-user`](#docker-user)
  - [`docker-volumes`](#docker-volumes)
  - [`env-regex`](#env-regex)
  - [`mount-docker-socket`](#mount-docker-socket)
  - [`token`](#token)
  - [`renovate-image`](#renovate-image)
  - [`renovate-version`](#renovate-version)
- [Example](#example)
- [Environment Variables](#environment-variables)
  - [Passing other environment variables](#passing-other-environment-variables)
- [Persisting the Repository Cache](#persisting-the-repository-cache)
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

Options can be passed using the inputs of this action or the corresponding environment variables.
When both are passed, the input takes precedence over the environment variable.
For the available environment variables, see the Renovate [Self-Hosted Configuration](https://docs.renovatebot.com/self-hosted-configuration/) docs.

### `configurationFile`

Configuration file to configure Renovate ("global" config) in JavaScript or JSON format.
It is recommended to not name it one of the repository configuration filenames listed in the Renovate Docs for [Configuration Options](https://docs.renovatebot.com/configuration-options/).

Config examples can be found in the [example](./example) directory.

The configurations that can be done in this file consists of two parts, as listed below.
Refer to the links to the [Renovate Docs](https://docs.renovatebot.com/) for all options.

1. [Self-Hosted Configuration Options](https://docs.renovatebot.com/self-hosted-configuration/)
2. [Configuration Options](https://docs.renovatebot.com/configuration-options/)

The [`branchPrefix`](https://docs.renovatebot.com/configuration-options/#branchprefix) option is important to configure and should be configured to a value other than the default to prevent interference with e.g. the Renovate GitHub App.

If you want to use this with just the single configuration file, make sure to include the following two configuration lines.
This disables the requirement of a configuration file for the repository and disables onboarding.

```js
  onboarding: false,
  requireConfig: 'optional',
```

### `docker-cmd-file`

Specify a command to run when the image start.
By default the image run
`renovate`.
This option is useful to customize the image before running `renovate`.
It must be an existing executable file on the local system.
It will be mounted to the docker container.

For example you can create a simple script like this one (let's call it
`renovate-entrypoint.sh`).

```sh
#!/bin/bash

apt update

apt install -y build-essential libpq-dev

runuser -u ubuntu renovate
```

Now use this action

```yml
....
jobs:
  renovate:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4.2.2
      - name: Self-hosted Renovate
        uses: renovatebot/github-action@v41.0.11
        with:
          docker-cmd-file: .github/renovate-entrypoint.sh
          docker-user: root
          token: ${{ secrets.RENOVATE_TOKEN }}
```

### `docker-network`

Specify a network to run container in.

You can use `${{ job.container.network }}` to run renovate container [in the same network as other containers for this job](https://docs.github.com/en/actions/learn-github-actions/contexts#job-context),
or set it to `host` to run in the same network as github runner, or specify any custom network.

### `docker-socket-host-path`

Allows the overriding of the host path for the Docker socket that is mounted into the container.
Useful on systems where the host Docker socket is located somewhere other than `/var/run/docker.sock` (the default).
Only applicable when `mount-docker-socket` is true.

### `docker-user`

Specify a user (or user-id) to run docker command.

You can use it with [`docker-cmd-file`](#docker-cmd-file) in order to start the
image as root, do some customization and switch back to a unprivileged user.

### `docker-volumes`

Specify volume mounts. Defaults to `/tmp:/tmp`.
The volume mounts are separated through `;`.

This sample will mount `/tmp:/tmp` and `/foo:/bar`.

```yml
....
jobs:
  renovate:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4.2.2
      - name: Self-hosted Renovate
        uses: renovatebot/github-action@v41.0.11
        with:
          token: ${{ secrets.RENOVATE_TOKEN }}
          docker-volumes: |
            /tmp:/tmp ;
            /foo:/bar
```

### `env-regex`

Allows to configure the regex to define which environment variables are passed to the renovate container.
See [Passing other environment variables](#passing-other-environment-variables) section for more details.

## `mount-docker-socket`

Default to `false`. If set to `true` the action will mount the Docker socket
inside the renovate container so that the commands can use Docker. Can be useful
for `postUpgradeTasks`'s commands. Also add the user inside the renovate
container to the docker group for socket permissions.

### `token`

[Generate a Personal Access Token (classic)](https://github.com/settings/tokens), with the `repo:public_repo` scope for only public repositories or the `repo` scope for public and private repositories, and add it to _Secrets_ (repository settings) as `RENOVATE_TOKEN`.
You can also create a token without a specific scope, which gives read-only access to public repositories, for testing.
This token is only used by Renovate, see the [token configuration](https://docs.renovatebot.com/self-hosted-configuration/#token), and gives it access to the repositories.
The name of the secret can be anything as long as it matches the argument given to the `token` option.

Note that Renovate _cannot_ currently use [Fine-grained Personal Access Tokens](https://github.com/settings/tokens?type=beta) since they do not support the GitHub GraphQL API, yet.

Note that the [`GITHUB_TOKEN`](https://help.github.com/en/actions/configuring-and-managing-workflows/authenticating-with-the-github_token#permissions-for-the-github_token) secret can't be used for authenticating Renovate because it has too restrictive permissions.
In particular, using the `GITHUB_TOKEN` to create a new `Pull Request` from more types of Github Workflows results in `Pull Requests` that [do not trigger your `Pull Request` and `Push` CI events](https://docs.github.com/en/actions/security-guides/automatic-token-authentication#using-the-github_token-in-a-workflow).

If you want to use the `github-actions` manager, you must setup a [special token](#special-token-requirements-when-using-the-github-actions-manager) with some requirements.

### `renovate-image`

The Renovate Docker image name to use.
If omitted the action will use the `ghcr.io/renovatebot/renovate:<renovate-version>` Docker image name otherwise.
If a Docker image name is defined, the action will use that name to pull the image.

This sample will use `myproxyhub.domain.com/renovate/renovate:<renovate-version>` image.

```yml
....
jobs:
  renovate:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4.2.2
      - name: Self-hosted Renovate
        uses: renovatebot/github-action@v41.0.11
        with:
          renovate-image: myproxyhub.domain.com/renovate/renovate
          token: ${{ secrets.RENOVATE_TOKEN }}
```

This sample will use `ghcr.io/renovatebot/renovate:<renovate-version>` image.

```yml
....
jobs:
  renovate:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4.2.2
      - name: Self-hosted Renovate
        uses: renovatebot/github-action@v41.0.11
        with:
          token: ${{ secrets.RENOVATE_TOKEN }}
```

### `renovate-version`

The Renovate version to use.
If omitted the action will use the [`default version`](./action.yml#L28) Docker tag.
Check [the available tags on Docker Hub](https://hub.docker.com/r/renovate/renovate/tags).

This sample will use `ghcr.io/renovatebot/renovate:39.156.1` image.

```yml
....
jobs:
  renovate:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4.2.2
      - name: Self-hosted Renovate
        uses: renovatebot/github-action@v41.0.11
        with:
          renovate-version: 39.156.1
          token: ${{ secrets.RENOVATE_TOKEN }}
```

This sample will use `ghcr.io/renovatebot/renovate:full` image.

```yml
....
jobs:
  renovate:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4.2.2
      - name: Self-hosted Renovate
        uses: renovatebot/github-action@v41.0.11
        with:
          renovate-version: full
          token: ${{ secrets.RENOVATE_TOKEN }}
```

We recommend you pin the version of Renovate to a full version or a full checksum, and use Renovate's regex manager to create PRs to update the pinned version.
See `.github/workflows/build.yml` for an example of how to do this.

## Example

This example uses a Personal Access Token and will run every 15 minutes.
The Personal Access token is configured as a GitHub secret named `RENOVATE_TOKEN`.
This example uses the [`example/renovate-config.js`](./example/renovate-config.js) file as configuration.
Live examples with more advanced configurations of this action can be found in the following repositories:

- [vidavidorra/renovate](https://github.com/vidavidorra/renovate/blob/main/.github/renovate.json)
- [jenkinsci/helm-charts](https://github.com/jenkinsci/helm-charts/blob/main/.github/renovate-config.json5)

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
        uses: actions/checkout@v4.2.2
      - name: Self-hosted Renovate
        uses: renovatebot/github-action@v41.0.11
        with:
          configurationFile: example/renovate-config.js
          token: ${{ secrets.RENOVATE_TOKEN }}
```

### Example for GitHub Enterprise

If you want to use the Renovate Action on a GitHub Enterprise instance you have to add the following environment variable:

```yml
....
      - name: Self-hosted Renovate
        uses: renovatebot/github-action@v41.0.11
        with:
          configurationFile: example/renovate-config.js
          token: ${{ secrets.RENOVATE_TOKEN }}
        env:
          RENOVATE_ENDPOINT: "https://git.your-company.com/api/v3"
```

### Example with GitHub App

Instead of using a Personal Access Token (PAT) that is tied to a particular user you can use a [GitHub App](https://docs.github.com/en/developers/apps/building-github-apps) where permissions can be even better tuned.
[Create a new app](https://docs.github.com/en/developers/apps/creating-a-github-app) and configure the app permissions and your `config.js` as described in the [Renovate documentation](https://docs.renovatebot.com/modules/platform/github/#running-as-a-github-app).

Generate and download a new private key for the app, adding the contents of the downloaded `.pem` file to _Secrets_ (repository settings) with the name `private_key` and app ID as a secret with name `app_id`.

Adjust your Renovate configuration file to specify the username of your bot.

Going forward we will be using the [`actions/create-github-app-token` action](https://github.com/actions/create-github-app-token) in order to exchange the GitHub App certificate for an access token that Renovate can use.

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
        uses: actions/create-github-app-token@v1
        with:
          private-key: ${{ secrets.private_key }}
          app-id: ${{ secrets.app_id }}
          owner: ${{ github.repository_owner }}
          repositories: 'repo1,repo2'

      - name: Checkout
        uses: actions/checkout@v4.2.2

      - name: Self-hosted Renovate
        uses: renovatebot/github-action@v41.0.11
        with:
          configurationFile: example/renovate-config.js
          token: '${{ steps.get_token.outputs.token }}'
```

### Commit signing with GitHub App

Renovate can sign commits when deployed as a GitHub App by utilizing GitHub's API-based commits.
To activate this, ensure that `platformCommit` is set to `true` in global config.
If a configuration file is defined, include `platformCommit: true` to activate this feature.
For example:

```yaml
- name: Self-hosted Renovate
  uses: renovatebot/github-action@v41.0.11
  with:
    token: '${{ steps.get_token.outputs.token }}'
  env:
    RENOVATE_PLATFORM_COMMIT: 'true'
```

## Environment Variables

If you wish to pass through environment variables through to the Docker container that powers this action you need to prefix the environment variable with `RENOVATE_`.

For example if you wish to pass through some credentials for a [host rule](https://docs.renovatebot.com/configuration-options/#hostrules) to the `config.js` then you should do so like this.

1. In your workflow pass in the environment variable

   ```yml
   ....
   jobs:
     renovate:
       runs-on: ubuntu-latest
       steps:
         - name: Checkout
           uses: actions/checkout@v4.2.2
         - name: Self-hosted Renovate
           uses: renovatebot/github-action@v41.0.11
           with:
             configurationFile: example/renovate-config.js
             token: ${{ secrets.RENOVATE_TOKEN }}
           env:
             RENOVATE_TFE_TOKEN: ${{ secrets.MY_TFE_TOKEN }}
   ```

1. In `example/renovate-config.js` include the hostRules block

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
        uses: actions/checkout@v4.2.2
      - name: Self-hosted Renovate
        uses: renovatebot/github-action@v41.0.11
        with:
          configurationFile: example/renovate-config.js
          token: ${{ secrets.RENOVATE_TOKEN }}
          env-regex: "^(?:RENOVATE_\\w+|LOG_LEVEL|GITHUB_COM_TOKEN|NODE_OPTIONS|AWS_TOKEN)$"
        env:
          AWS_TOKEN: ${{ secrets.AWS_TOKEN }}
```

## Persisting the repository cache

In some cases, Renovate can update PRs more frequently than you expect. The [repository cache](https://docs.renovatebot.com/self-hosted-configuration/#repositorycache) can help with this issue. You need a few things to persist this cache in GitHub actions:

1. Enable the `repositoryCache` [option](https://docs.renovatebot.com/self-hosted-configuration/#repositorycache) via env vars or renovate.json.
2. Persist `/tmp/renovate/cache/renovate/repository` as an artifact.
3. Restore the artifact before renovate runs.

Below is a workflow example with caching.

Note that while archiving and compressing the cache is more performant, especially if you need to handle lots of files within the cache, it's not strictly necessary. You could simplify this workflow and only upload and download a single artifact file (or directory) with a direct path (e.g. `/tmp/renovate/cache/renovate/repository/github/$org/$repo.json`). However, you'll still need to set the correct permissions with `chown` as shown in the example.

```yml
name: Renovate
on:
  # This lets you dispatch a renovate job with different cache options if you want to reset or disable the cache manually.
  workflow_dispatch:
    inputs:
      repoCache:
        description: 'Reset or disable the cache?'
        type: choice
        default: enabled
        options:
          - enabled
          - disabled
          - reset
  schedule:
    # Run every 30 minutes:
    - cron: '0,30 * * * *'

# Adding these as env variables makes it easy to re-use them in different steps and in bash.
env:
  cache_archive: renovate_cache.tar.gz
  # This is the dir renovate provides -- if we set our own directory via cacheDir, we can run into permissions issues.
  # It is also possible to cache a higher level of the directory, but it has minimal benefit. While renovate execution
  # time gets faster, it also takes longer to upload the cache as it grows bigger.
  cache_dir: /tmp/renovate/cache/renovate/repository
  # This can be manually changed to bust the cache if neccessary.
  cache_key: renovate-cache

jobs:
  renovate:
    name: Renovate
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      # This third party action allows you to download the cache artifact from different workflow runs
      # Note that actions/cache doesn't work well because the cache key would need to be computed from
      # a file within the cache, meaning there would never be any data to restore. With other keys, the
      # cache wouldn't necessarily upload when it changes. actions/download-artifact also doesn't work
      # because it only handles artifacts uploaded in the same run, and we want to restore from the
      # previous successful run.
      - uses: dawidd6/action-download-artifact@v2
        if: github.event.inputs.repoCache != 'disabled'
        continue-on-error: true
        with:
          name: ${{ env.cache_key }}
          path: cache-download

      # Using tar to compress and extract the archive isn't strictly necessary, but it can improve
      # performance significantly when uploading artifacts with lots of files.
      - name: Extract renovate cache
        run: |
          set -x
          # Skip if no cache is set, such as the first time it runs.
          if [ ! -d cache-download ] ; then
            echo "No cache found."
            exit 0
          fi

          # Make sure the directory exists, and extract it there. Note that it's nested in the download directory.
          mkdir -p $cache_dir
          tar -xzf cache-download/$cache_archive -C $cache_dir

          # Unfortunately, the permissions expected within renovate's docker container
          # are different than the ones given after the cache is restored. We have to
          # change ownership to solve this. We also need to have correct permissions in
          # the entire /tmp/renovate tree, not just the section with the repo cache.
          sudo chown -R 12021:0 /tmp/renovate/
          ls -R $cache_dir

      - uses: renovatebot/github-action@v41.0.11
        with:
          configurationFile: renovate.json5
          token: ${{ secrets.RENOVATE_TOKEN }}
          renovate-version: 39.156.1
        env:
          # This enables the cache -- if this is set, it's not necessary to add it to renovate.json.
          RENOVATE_REPOSITORY_CACHE: ${{ github.event.inputs.repoCache || 'enabled' }}

      # Compression helps performance in the upload step!
      - name: Compress renovate cache
        run: |
          ls $cache_dir
          # The -C is important -- otherwise we end up extracting the files with
          # their full path, ultimately leading to a nested directory situation.
          # To solve *that*, we'd have to extract to root (/), which isn't safe.
          tar -czvf $cache_archive -C $cache_dir .

      - uses: actions/upload-artifact@v3
        if: github.event.inputs.repoCache != 'disabled'
        with:
          name: ${{ env.cache_key }}
          path: ${{ env.cache_archive }}
          # Since this is updated and restored on every run, we don't need to keep it
          # for long. Just make sure this value is large enough that multiple renovate
          # runs can happen before older cache archives are deleted.
          retention-days: 1
```

## Troubleshooting

### Debug logging

In case of issues, it's always a good idea to enable debug logging first.
To enable debug logging, add the environment variable `LOG_LEVEL: 'debug'` to the action:

```yml
- name: Self-hosted Renovate
  uses: renovatebot/github-action@v41.0.11
  with:
    configurationFile: example/renovate-config.js
    token: ${{ secrets.RENOVATE_TOKEN }}
  env:
    LOG_LEVEL: 'debug'
```

### Special token requirements when using the `github-actions` manager

If you want to use the `github-actions` [manager](https://docs.renovatebot.com/modules/manager/github-actions/) in Renovate, ensure that the `token` you provide contains the `workflow` scope.
Otherwise, GitHub does not allow Renovate to update workflow files and therefore it will be unable to create update PRs for affected packages (like `actions/checkout` or `renovatebot/github-action` itself).
