FROM renovate/renovate:19.219.11-slim

COPY entrypoint.sh /usr/entrypoint.sh

ENTRYPOINT ["/usr/entrypoint.sh"]

RUN set -ex; whoami; groups

USER root
