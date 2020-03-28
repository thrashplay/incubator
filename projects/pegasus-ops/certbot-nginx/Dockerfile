FROM certbot/certbot:arm32v6-v1.3.0

RUN apk update && \
    apk add certbot-nginx

COPY scripts/entry-point.sh /usr/local/bin
RUN chmod +x /usr/local/bin/entry-point.sh

ENTRYPOINT [ "/usr/local/bin/entry-point.sh" ]