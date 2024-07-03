# GitHub Action Renovate

Use this GitHub Action to self-host Renovate.

> [!IMPORTANT]
> The version number of `renovatebot/github-action` is _different_ from that of `renovatebot/renovate`!
> By default, `renovabot/github-action` uses the latest version of Renovate from the `ghcr.io/renovatebot/renovate:latest` Docker image.

## Options

You can pass options with either:

- The inputs of this action.
- Or, with the corresponding Renovate self-hosted environment variables.

> [!NOTE]
> When you provide an input _and_ a environment variable, _the input is used_ over the enviroment variable!

See the full list of environment variables in the [Renovate docs, Self-Hosted Configuration](https://docs.renovatebot.com/self-hosted-configuration/).

### `configurationFile`

Configuration file to configure Renovate ("global" config) in JavaScript or JSON format.

We recommend you avoid names that match repository configuration filenames listed in the Renovate Docs for [Configuration Options](https://docs.renovatebot.com/configuration-options/).

You can find configuration examples in the [example directory](./example).

The configurations that can be done in this file consists of two parts, as listed below.
Refer to the links to the [Renovate Docs](https://docs.renovatebot.com/) for all options.

1. [Self-Hosted Configuration Options](https://docs.renovatebot.com/self-hosted-configuration/)
2. [Configuration Options](https://docs.renovatebot.com/configuration-options/)

If you want to use the Mend Renovate app _and_ this `renovatebot/github-action`, then you must set the [`branchPrefix`](https://docs.renovatebot.com/configuration-options/#branchprefix) to a different value than the default!
This prevents interference with the Mend Renovate app, or other apps.

If you want to use a single configuration file, make sure to include the following two configuration lines.
This disables the requirement of a configuration file for the repository and disables onboarding.

```js
  onboarding: false,
  requireConfig: false,
```

### `docker-cmd-file`

By default, the image runs the `renovate` command.

Use `docker-cmd-file` to set which command(s) run when the image starts.
With this option you can customize the image before it runs the`renovate` command.

`docker-cmd-file` must point to an _existing executable file_ on the local system.
This file will be mounted to the Docker container.

For example, you may create a simple script called `renovate-entrypoint.sh`:

```sh
#!/bin/bash

apt update

apt install -y build-essential libpq-dev

runuser -u ubuntu renovate
```

Now use this Action:

```yaml
....
jobs:
  renovate:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4.1.7
      - name: Self-hosted Renovate
        uses: renovatebot/github-action@v40.1.12
        with:
          docker-cmd-file: .github/renovate-entrypoint.sh
          docker-user: root
          token: ${{ secrets.RENOVATE_TOKEN }}
```

### `docker-network`

Specify a network to run container in.

You can use `${{ job.container.network }}` to run renovate container [in the same network as other containers for this job](https://docs.github.com/en/actions/learn-github-actions/contexts#job-context),
or set it to `host` to run in the same network as github runner, or specify any custom network.

### `docker-user`

Specify a `user` (or `user-id`) to run Docker commands as.

You can use it with a [`docker-cmd-file`](#docker-cmd-file) to start the image as root, do some customization and then _switch back to a unprivileged user_.

### `docker-volumes`

Defaults to `/tmp:/tmp`.

Use `docker-volumes` to set volume mounts.
Separate each volume mount with a `;` character.

The following example mounts three volumes:

- `/tmp:/tmp`
- `/home:/home`
- `/foo:/bar`

```yml
....
jobs:
  renovate:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4.1.7
      - name: Self-hosted Renovate
        uses: renovatebot/github-action@v40.1.12
        with:
          token: ${{ secrets.RENOVATE_TOKEN }}
          docker-volumes: |
            /tmp:/tmp ;
            /home:/home ;
            /foo:/bar
```

### `env-regex`

Use `env-regex` to set which environment variables are passed to the Renovate container.
Uses the JavaScript regex syntax.

Read the [Passing other environment variables](#passing-other-environment-variables) section to learn more.

## `mount-docker-socket`

Default to `false`.

If set to `true` the action mounts the Docker socket inside the Renovate container, so that the commands can use Docker.
Can be useful for `postUpgradeTasks`'s commands.
Also add the user inside the Renovate container to the Docker group for socket permissions.

### `token`

[Generate a Personal Access Token (classic)](https://github.com/settings/tokens):

1. Give it the `repo:public_repo` scope for public repositories.
2. _Or_ give it the `repo` scope for public and private repositories.
3. Add it to _Secrets_ (repository settings) as `RENOVATE_TOKEN`.

You can also create a token with no specific scope, which gives read-only access to public repositories, for testing.
This token is only used by Renovate, see the [token configuration](https://docs.renovatebot.com/self-hosted-configuration/#token), and gives it access to the repositories.
When naming your secret, follow the rules from the [GitHub Docs, naming your secrets](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions#naming-your-secrets).
The name of the secret must match the argument given to the `token` option.

You can not use a [`GITHUB_TOKEN`](https://help.github.com/en/actions/configuring-and-managing-workflows/authenticating-with-the-github_token#permissions-for-the-github_token) secret to authenticate Renovate because the `GITHUB_TOKEN` limits permissions too much.
In particular, using the `GITHUB_TOKEN` to create a new `Pull Request` from more types of Github Workflows results in `Pull Requests` that [do not trigger your `Pull Request` and `Push` CI events](https://docs.github.com/en/actions/security-guides/automatic-token-authentication#using-the-github_token-in-a-workflow).

If you want to use Renovate's `github-actions` manager, you must setup a [special token](#special-token-requirements-when-using-the-github-actions-manager) with some special requirements.

### `renovate-image`

The Renovate Docker image name to use.

By default, the action uses the `ghcr.io/renovatebot/renovate` Docker image name.
This default applies if you do not set any name, or set `renovate-image === ''`.

But if you set a Docker image name, the action will use that name to pull the image.

This example makes the action use the `myproxyhub.domain.com/renovate/renovate` image:

```yaml
....
jobs:
  renovate:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4.1.7
      - name: Self-hosted Renovate
        uses: renovatebot/github-action@v40.1.12
        with:
          renovate-image: myproxyhub.domain.com/renovate/renovate
          token: ${{ secrets.RENOVATE_TOKEN }}
```

This example makes the action use the `ghcr.io/renovatebot/renovate` image:

```yaml
....
jobs:
  renovate:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4.1.7
      - name: Self-hosted Renovate
        uses: renovatebot/github-action@v40.1.12
        with:
          token: ${{ secrets.RENOVATE_TOKEN }}
```

### `renovate-version`

By default, the action uses the _latest_ version of Renovate, because the action uses the `latest` Docker tag.

Use `renovate-version`to control which version of Renovate the action uses.
Check [the available tags on Docker Hub](https://hub.docker.com/r/renovate/renovate/tags).

This example makes the action use the `ghcr.io/renovatebot/renovate:37.421.3` image:

```yaml
....
jobs:
  renovate:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4.1.7
      - name: Self-hosted Renovate
        uses: renovatebot/github-action@v40.1.12
        with:
          renovate-version: 37.421.3
          token: ${{ secrets.RENOVATE_TOKEN }}
```

This example makes the action use the `ghcr.io/renovatebot/renovate:full` image:

```yaml
....
jobs:
  renovate:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4.1.7
      - name: Self-hosted Renovate
        uses: renovatebot/github-action@v40.1.12
        with:
          renovate-version: full
          token: ${{ secrets.RENOVATE_TOKEN }}
```

We recommend you pin your version of Renovate to a full version, or a full checksum.
Use Renovate's regex manager to tell Renovate how to create PRs to update the pinned version.
See `.github/workflows/build.yml` for an example.

## Example

This example uses a Personal Access Token (PAT) and will run the action every 15 minutes.
The PAT is configured as a GitHub secret called `RENOVATE_TOKEN`.
This example uses the [`example/renovate-config.js`](./example/renovate-config.js) file as configuration.

Here are some real-world examples with more advanced configurations:

- [the `vidavidorra/renovate` repository on GitHub](https://github.com/vidavidorra/renovate/blob/main/.github/renovate.json)
- [the `jenkinsci/helm-charts`repository on GitHub](https://github.com/jenkinsci/helm-charts/blob/main/.github/renovate-config.json5)

> [!TIP]
> These examples may show old versions of our action.
> When you copy/paste from these examples, remember to update the action to the latest version!
> Go to [`renovatebot/github-actions` release page on GitHub](https://github.com/renovatebot/github-action/releases/latest) to see the latest release.

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
        uses: actions/checkout@v4.1.7
      - name: Self-hosted Renovate
        uses: renovatebot/github-action@v40.1.12
        with:
          configurationFile: example/renovate-config.js
          token: ${{ secrets.RENOVATE_TOKEN }}
```

### Example for GitHub Enterprise

To use the Renovate Action on a GitHub Enterprise instance you must add the following environment variable:

```yaml
....
      - name: Self-hosted Renovate
        uses: renovatebot/github-action@v40.1.12
        with:
          configurationFile: example/renovate-config.js
          token: ${{ secrets.RENOVATE_TOKEN }}
        env:
          RENOVATE_ENDPOINT: "https://git.your-company.com/api/v3"
```

### Example with GitHub App

Instead of using a Personal Access Token (PAT) that is tied to a particular user you can use a [GitHub App](https://docs.github.com/en/developers/apps/building-github-apps) where permissions can be even better tuned.
[Create a new app](https://docs.github.com/en/developers/apps/creating-a-github-app) and configure the app permissions and your `config.js` as explained in the [Renovate documentation](https://docs.renovatebot.com/modules/platform/github/#running-as-a-github-app).

Generate and download a new private key for the app, adding the contents of the downloaded `.pem` file to _Secrets_ (repository settings) with the name `private_key` and app ID as a secret with name `app_id`.
Edit your Renovate configuration file so it sets the username of your bot!

In this example we use the [`actions/create-github-app-token` action](https://github.com/actions/create-github-app-token) to exchange the GitHub App certificate for an access token that Renovate can use.

The final workflow looks like this:

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
        uses: actions/checkout@v4.1.7

      - name: Self-hosted Renovate
        uses: renovatebot/github-action@v40.1.12
        with:
          configurationFile: example/renovate-config.js
          token: '${{ steps.get_token.outputs.token }}'
```

### Commit signing with GitHub App

Renovate can sign commits when deployed as a GitHub App.

Renovate uses GitHub's API-based commits to sign commits.
To enable commit-signing set `platformCommit` to `true` in your global config, or in your local configuration file.
For example:

```yaml
- name: Self-hosted Renovate
  uses: renovatebot/github-action@v40.1.12
  with:
    token: '${{ steps.get_token.outputs.token }}'
  env:
    RENOVATE_PLATFORM_COMMIT: 'true'
```

## Environment Variables

To pass through environment variables through to the Docker container that powers this action, you must prefix the environment variable with `RENOVATE_`.

For example, if you wish to pass through some credentials for a [host rule](https://docs.renovatebot.com/configuration-options/#hostrules) to the `config.js` then you should do so like this:

1. In your workflow pass in the environment variable

   ```yml
   ....
   jobs:
     renovate:
       runs-on: ubuntu-latest
       steps:
         - name: Checkout
           uses: actions/checkout@v4.1.7
         - name: Self-hosted Renovate
           uses: renovatebot/github-action@v40.1.12
           with:
             configurationFile: example/renovate-config.js
             token: ${{ secrets.RENOVATE_TOKEN }}
           env:
             RENOVATE_TFE_TOKEN: ${{ secrets.MY_TFE_TOKEN }}
   ```

1. In `example/renovate-config.js` include the hostRules block:

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

In your workflow pass the environment variable and whitelist it by setting the `env-regex`:

```yml
....
jobs:
  renovate:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4.1.7
      - name: Self-hosted Renovate
        uses: renovatebot/github-action@v40.1.12
        with:
          configurationFile: example/renovate-config.js
          token: ${{ secrets.RENOVATE_TOKEN }}
          env-regex: "^(?:RENOVATE_\\w+|LOG_LEVEL|GITHUB_COM_TOKEN|NODE_OPTIONS|AWS_TOKEN)$"
        env:
          AWS_TOKEN: ${{ secrets.AWS_TOKEN }}
```

## Persisting the repository cache

In some cases, Renovate can update PRs more frequently than you expect.
The [repository cache](https://docs.renovatebot.com/self-hosted-configuration/#repositorycache) can help with this issue.
You need a few things to persist this cache in GitHub Actions:

1. Enable the `repositoryCache` [option](https://docs.renovatebot.com/self-hosted-configuration/#repositorycache) via environment variables, or in your `renovate.json.` file.
2. Persist `/tmp/renovate/cache/renovate/repository` as an artifact.
3. Restore the artifact _before_ Renovate runs.

### Example workflow with caching

Archiving and compressing the cache is faster, especially if you handle lots of files within the cache, but it's not strictly needed.
If you want, you can simplify this workflow by only uploading and downloading a _single artifact file_ (or directory) with a direct path like: `/tmp/renovate/cache/renovate/repository/github/$org/$repo.json`.
But even in the simplified workflow, you must still set the correct permissions with `chown` as shown in the example.

```yml
name: Renovate
on:
  # This lets you dispatch a Renovate job with different cache options, which is handy if you want to reset (or disable) the cache manually.
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

# Adding these as environment variables makes it easy to re-use them in different steps and in Bash.
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

      # This third-party Action allows you to download the cache artifact from different workflow runs
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

          # Unfortunately, the permissions expected within Renovate's Docker container
          # are different than the ones given after the cache is restored. We must
          # change ownership to solve this. We also must have the correct permissions in
          # the entire /tmp/renovate tree, not just the section with the repo cache.
          sudo chown -R runneradmin:root /tmp/renovate/
          ls -R $cache_dir

      - uses: renovatebot/github-action@v40.1.12
        with:
          configurationFile: renovate.json5
          token: ${{ secrets.RENOVATE_TOKEN }}
          renovate-version: 37.421.3
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
          # for long. Just make sure this value is large enough that multiple Renovate
          # runs can happen before older cache archives are deleted.
          retention-days: 1
```

## Troubleshooting

### Debug logging

If you have problems, a good first step is to enable debug logging.

Enable debug logging by adding the environment variable `LOG_LEVEL: 'debug'` to the Action:

```yml
- name: Self-hosted Renovate
  uses: renovatebot/github-action@v40.1.12
  with:
    configurationFile: example/renovate-config.js
    token: ${{ secrets.RENOVATE_TOKEN }}
  env:
    LOG_LEVEL: 'debug'
```

### Special token requirements when using the `github-actions` manager

If you want to use the `github-actions` [manager](https://docs.renovatebot.com/modules/manager/github-actions/) in Renovate, the `token` you give must have the `workflow` scope.
If you skip this step, GitHub will block Renovate from updating workflow files, this in turn means that Renovate can _not_ create update PRs for affected packages, like `actions/checkout` or `renovatebot/github-action`!
