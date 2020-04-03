FROM homeassistant/home-assistant:stable

RUN apk update && apk add --no-cache tini

COPY scripts/entry-point.sh /usr/local/bin
RUN chmod +x /usr/local/bin/entry-point.sh

EXPOSE 8123

ENTRYPOINT [ "/sbin/tini", "--" ]
CMD [ "/usr/local/bin/entry-point.sh" ]