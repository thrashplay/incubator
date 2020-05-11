FROM alpine:3.9.6

# install needed utilities
RUN apk update && apk add --no-cache \
  bash \
  curl \
  inotify-tools \
  tini \
  unzip

# install rclone
RUN cd /tmp && \
  curl -O https://rclone.org/install.sh && \
  bash install.sh && \
  rm install.sh

# add entrypoint
COPY scripts/entry-point.sh /usr/local/bin
RUN chmod +x /usr/local/bin/entry-point.sh

ENTRYPOINT [ "/sbin/tini", "--" ]
CMD [ "/usr/local/bin/entry-point.sh" ]