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
# https://github.com/renovatebot/docker-renovate/blob/d3aa0d99931ea7ad7e901a1e538eba0d61268229/Dockerfile#L63
RENOVATE_TOKEN="${TOKEN}" renovate
