#!/bin/bash
#
# Entrypoint for Docker.

export RENOVATE_CONFIG_FILE="${GITHUB_WORKSPACE}/${1}"
readonly _RENOVATE_TOKEN="${2}"

# We are running as ubuntu, so no write access to /github/home
export HOME=/home/ubuntu

if [[ ! -f "${RENOVATE_CONFIG_FILE}" ]]; then
  echo "ERROR: Couldn't find file ${RENOVATE_CONFIG_FILE}" 1>&2
  exit 1
fi

# Run Renovate.
#
# Mimic the original ENTRYPOINT of the renovate/renovate Docker container. See
# the following link for this entry.
# https://github.com/renovatebot/docker-renovate/blob/d3aa0d99931ea7ad7e901a1e538eba0d61268229/Dockerfile#L63

RENOVATE_TOKEN="${_RENOVATE_TOKEN}" /usr/local/bin/docker-entrypoint.sh
