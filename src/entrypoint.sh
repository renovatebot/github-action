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
#RENOVATE_TOKEN="${TOKEN}" node /usr/src/app/dist/renovate.js

config=$(basename RENOVATE_CONFIG_FILE)

# renovate: datasource=docker depName=renovate/renovate versioning=docker
ARG RENOVATE_VERSION=19.219.11-slim

docker run --rm -e RENOVATE_TOKEN="${TOKEN}" -e RENOVATE_CONFIG_FILE=/$config -v /tmp:/tmp -v $RENOVATE_CONFIG_FILE:/$config renovate/renovate
