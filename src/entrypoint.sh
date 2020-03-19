#!/bin/bash
#
# Entrypoint for Docker.

readonly CONFIGURATION_FILE="${1}"
readonly TOKEN="${2}"

readonly CONFIGURATION_PATH="${GITHUB_WORKSPACE}/${CONFIGURATION_FILE}"

if [[ ! -f "${CONFIGURATION_PATH}" ]]; then
  echo "ERROR: Couldn't find file ${CONFIGURATION_PATH}" 1>&2
  exit 1
fi

readonly WORKDIR='/usr/src/app'
# Account for the WORKDIR entry of the renovate/renovate Docker container. See
# the followling link for this entry.
# https://github.com/renovatebot/renovate/blob/19.175.3/Dockerfile#L14
cd "${WORKDIR}" || { echo "ERROR: Couldn't cd to ${WORKDIR}" 1>&2; exit 1; }

cp "${CONFIGURATION_PATH}" './config.js'

# Run Renovate.
#
# Mimic the original ENTRYPOINT of the renovate/renovate Docker container. See
# the following link for this entry.
# https://github.com/renovatebot/renovate/blob/19.175.3/Dockerfile#L220
RENOVATE_TOKEN="${TOKEN}" node /usr/src/app/dist/renovate.js
