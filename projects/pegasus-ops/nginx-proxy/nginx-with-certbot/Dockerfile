FROM nginx:1.16-alpine

EXPOSE 80 443

# Install certbot
RUN apk update && apk add --no-cache certbot-nginx jq tini

VOLUME /etc/letsencrypt
VOLUME /var/lib/letsencrypt

COPY scripts/* /usr/local/bin/

ENTRYPOINT [ "/sbin/tini", "--" ]
CMD [ "/usr/local/bin/entry-point.sh" ]