# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## 1.0.0 (2020-03-20)

### Features

- add self-hosted renovate sources ([5f5662b](https://github.com/vidavidorra/github-action-renovate/commit/5f5662bb8600d82e9e23ac911d56ec943ab3c0ff))
- add token input and account for Renovate WORKDIR ([cd4dee3](https://github.com/vidavidorra/github-action-renovate/commit/cd4dee329720030349b278460f2f6ff8ddaca4c4))

### Bug Fixes

- add chmod+x for entrypoint ([f0979c4](https://github.com/vidavidorra/github-action-renovate/commit/f0979c49826eb1885a487e12c30cea1650e7266b))
- correct COPY in dockerfile for relative path ([341841e](https://github.com/vidavidorra/github-action-renovate/commit/341841ebc60c5c2a221ed49db2f91326bcd0cdd8))
- prefix configuration file with GitHub workspace dir ([26124b0](https://github.com/vidavidorra/github-action-renovate/commit/26124b07e464ef56a31f3e77425052bb67ac8a20))
- the Dockerfile MUST have a lowercase F for GitHub Action to work ([3e4d5f0](https://github.com/vidavidorra/github-action-renovate/commit/3e4d5f0dd6da60c4277b72bb0a26dd4dd2707dd7))
- typo in action 9DockerFile) ([5525465](https://github.com/vidavidorra/github-action-renovate/commit/5525465215bf73411f8a5b436105a1fc8175e031))

## 1.0.0 (2020-03-16)

### Features

- add lint workflows and update generic configs ([2ee6912](https://github.com/vidavidorra/repo-template/commit/2ee691247b656456eb97436c257c46b9fb955818))
- add Renovate to automatically update dependencies ([4021f01](https://github.com/vidavidorra/repo-template/commit/4021f0118d1f445e4a39a95cbcdd2dba52c70051))

### Bug Fixes

- **ci:** revert commitlint workflow to checkout v1 ([134e36d](https://github.com/vidavidorra/repo-template/commit/134e36dc47fea25980d6bcf7074be61f2521fbdf))
- **ci:** use checkout v2 with depth 0 for commitlint workflow ([1d04350](https://github.com/vidavidorra/repo-template/commit/1d04350a2c06ffd7b9a6f471dac5da158ca26612))
- add @types/node ([2f1ea96](https://github.com/vidavidorra/repo-template/commit/2f1ea967780af1d384daf7882f233c1e89ef1ef1))
- add configuration file for standard-version ([14c70de](https://github.com/vidavidorra/repo-template/commit/14c70de4ce3b80c9a0f05024b5123fb633a0608b))
- remove `git add` from lint-staged ([9ca416a](https://github.com/vidavidorra/repo-template/commit/9ca416aaac4fe3130a5c6f2846532a948c0008e9))
