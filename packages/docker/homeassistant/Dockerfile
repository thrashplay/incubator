FROM homeassistant/home-assistant:0.110.2

RUN apk update && apk add --no-cache tini

COPY scripts/entry-point.sh /usr/local/bin
RUN chmod +x /usr/local/bin/entry-point.sh

EXPOSE 8123

ENTRYPOINT [ "/sbin/tini", "--" ]
CMD [ "/usr/local/bin/entry-point.sh" ]
