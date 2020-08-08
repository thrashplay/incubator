FROM ubuntu:20.04

# Supported: k3os, raspios_lite, ubuntu
ARG DEFAULT_OS_ARCH=armhf
ARG DEFAULT_OS_VERSION=2020-05-28

# install dependencies
RUN apt-get update 
RUN apt-get --quiet --yes install \ 
      curl \
      nano \
      unzip \
      xorriso \
      xz-utils \
      zip \
    && \
    apt-get clean

# copy configuration to image
COPY config /osbuilder/config

# copy scripts to image
COPY scripts /usr/local/bin
RUN chmod +x /usr/local/bin/*

WORKDIR /osbuilder
ENV \
  # path to the raspbian image download cache
  IMAGE_PATH="" \
  # arch to get the image for
  OS_ARCH="${DEFAULT_OS_ARCH}" \
  # version to get the image for
  OS_VERSION="${DEFAULT_OS_VERSION}"

ENTRYPOINT [ "/usr/local/bin/entry-point" ]