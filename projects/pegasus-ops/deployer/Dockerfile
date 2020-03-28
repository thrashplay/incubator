FROM node:alpine3.10

RUN apk update && \
    apk add docker-cli

COPY scripts/entry-point.sh /usr/local/bin
RUN chmod +x /usr/local/bin/entry-point.sh

RUN adduser -D deployer
USER deployer

ENTRYPOINT [ "/usr/local/bin/entry-point.sh" ]