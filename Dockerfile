FROM ghcr.io/hoverkraft-tech/docker-base-images/super-linter:1.1.0@sha256:f600fdd9c95e222b3831181e206db1a58494c45390b0ee0001e32a3c2ddedc75

HEALTHCHECK --interval=5m --timeout=10s --start-period=30s --retries=3 CMD ["/bin/sh","-c","test -d /github/home"]
ARG UID=1000
ARG GID=1000
USER ${UID}:${GID}
