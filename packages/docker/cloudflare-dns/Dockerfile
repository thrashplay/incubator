FROM alpine

RUN apk add --no-cache --no-progress \
  curl \
  jq

COPY scripts /usr/local/bin
RUN chmod +x /usr/local/bin/*

ENTRYPOINT [ "/bin/sh" ]