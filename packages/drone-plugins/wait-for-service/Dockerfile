FROM alpine:3.11.5

RUN apk --update add netcat-openbsd && \
    rm -rf /var/lib/apt/lists/* && \
    rm /var/cache/apk/*

COPY scripts/entry-point.sh /usr/local/bin
RUN chmod +x /usr/local/bin/entry-point.sh

ENTRYPOINT [ "/usr/local/bin/entry-point.sh" ]