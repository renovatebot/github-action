#!/bin/bash
#
# Entrypoint for Docker.

configurationFile="${1}"

cp "${GITHUB_WORKSPACE}/${configurationFile}" '/usr/src/app/config.js'

# Run Renovate.
node /usr/src/app/dist/renovate.js
