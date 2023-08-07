#!/bin/sh

set -e

install-apt sl

exec runuser -u ubuntu renovate
