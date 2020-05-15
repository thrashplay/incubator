FROM alpine:3.11.6

# install needed utilities
RUN apk update && apk add --no-cache \
  bash \
  curl \
  unzip

# install rclone
RUN cd /tmp && \
  curl -O https://rclone.org/install.sh && \
  bash install.sh && \
  rm install.sh

ENTRYPOINT [ "/usr/bin/rclone" ]