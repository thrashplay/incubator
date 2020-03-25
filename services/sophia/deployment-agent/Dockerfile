FROM drone/drone-runner-docker:latest

COPY scripts/entry-point.sh /bin
COPY scripts/expand-environment-secrets.sh /bin

ENTRYPOINT [ "/bin/entry-point.sh" ]