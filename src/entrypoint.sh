#!/bin/bash
#
# Entrypoint for Docker.

readonly CONFIGURATION_FILE="${1}"
readonly TOKEN="${2}"

export RENOVATE_CONFIG_FILE="${GITHUB_WORKSPACE}/${CONFIGURATION_FILE}"

if [[ ! -f "${RENOVATE_CONFIG_FILE}" ]]; then
  echo "ERROR: Couldn't find file ${RENOVATE_CONFIG_FILE}" 1>&2
  exit 1
fi

# Run Renovate.
#
# Mimic the original ENTRYPOINT of the renovate/renovate Docker container. See
# the following link for this entry.
# https://github.com/renovatebot/renovate/blob/19.175.3/Dockerfile#L220
RENOVATE_TOKEN="${TOKEN}" node /usr/src/app/dist/renovate.js
