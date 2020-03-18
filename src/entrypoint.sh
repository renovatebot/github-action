#!/bin/bash
#
# Entrypoint for Docker.

configurationFile="${1}"

cp "${configurationFile}" '/usr/src/app/config.js'

# Run Renovate.
node /usr/src/app/dist/renovate.js
