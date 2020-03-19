#!/bin/bash
#
# Entrypoint for Docker.

readonly CONFIGURATION_FILE="${1}"
readonly CONFIGURATION_PATH="${GITHUB_WORKSPACE}/${CONFIGURATION_FILE}"

if [[ ! -f "${CONFIGURATION_PATH}" ]]; then
  echo "ERROR: Couldn't find file ${CONFIGURATION_PATH}" 1>&2
  exit 1
fi

cp "${CONFIGURATION_PATH}" '/usr/src/app/config.js'

# Run Renovate.
#
# This mimics the original entrypoint of the renovate/renovate Docker container.
# See the following link for this entrypoint in the renovate/renovate Docker
# container.
# https://github.com/renovatebot/renovate/blob/19.175.3/Dockerfile#L220
node /usr/src/app/dist/renovate.js
