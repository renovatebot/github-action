#!/bin/sh

set -e

apt update && apt install -y sl

exec runuser -u ubuntu renovate
