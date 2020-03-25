FROM drone/drone-runner-docker:latest

COPY scripts/entry-point.sh /bin
COPY scripts/expand-environment-secrets.sh /bin

ENTRYPOINT [ "/bin/sh", "-c", "/bin/entry-point.sh" ]