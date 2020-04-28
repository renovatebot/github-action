#!/bin/bash
#
# Entrypoint for Docker.

set -e

readonly CONFIGURATION_FILE="${INPUT_CONFIGURATIONFILE}"
readonly TOKEN="${INPUT_TOKEN}"

RENOVATE_CONFIG_FILE="${GITHUB_WORKSPACE}/${CONFIGURATION_FILE}"

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

CONFIG=$(basename $CONFIGURATION_FILE)

# renovate: datasource=docker depName=renovate/renovate versioning=docker
RENOVATE_VERSION=19.221.0-slim

echo "Pulling image: $RENOVATE_VERSION"
docker pull renovate/renovate:$RENOVATE_VERSION

export RENOVATE_TOKEN="${TOKEN}"

echo "Running image: $RENOVATE_VERSION"
set -x
docker run --rm -e RENOVATE_TOKEN -v /tmp:/tmp -v ${RENOVATE_CONFIG_FILE}:/usr/src/app/${CONFIG} renovate/renovate:$RENOVATE_VERSION
set +x

echo "Done"
