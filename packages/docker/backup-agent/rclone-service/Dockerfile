FROM thrashplay/rclone

# install needed utilities
RUN apk update && apk add --no-cache \
  tini

# add entrypoint
COPY scripts/entry-point.sh /usr/local/bin
RUN chmod +x /usr/local/bin/entry-point.sh

ENTRYPOINT [ "/sbin/tini", "--" ]
CMD [ "/usr/local/bin/entry-point.sh" ]