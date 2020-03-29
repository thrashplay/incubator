FROM nginx:1.16-alpine

EXPOSE 80 443

# Install certbot
RUN apk update && apk add --no-cache certbot-nginx jq tini

# workaround for https://github.com/certbot/certbot/issues/5199
# bucket_size directive must be in root nginx.conf, not an override
RUN sed -i '/http {/a server_names_hash_bucket_size 64;' /etc/nginx/nginx.conf

RUN echo "* * * * * root echo HELLO" | sudo tee -a /etc/crontab > /dev/null

VOLUME /etc/letsencrypt
VOLUME /var/lib/letsencrypt

COPY scripts/* /usr/local/bin/

ENTRYPOINT [ "/sbin/tini", "--" ]
CMD [ "/usr/local/bin/entry-point.sh" ]