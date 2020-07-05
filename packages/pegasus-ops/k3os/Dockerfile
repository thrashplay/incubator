FROM ubuntu:20.04

# Supported: k3os, raspios_lite, ubuntu
ARG DEFAULT_OS_TYPE=raspios_lite
ARG DEFAULT_OS_ARCH=armhf
ARG DEFAULT_OS_VERSION=2020-05-28

VOLUME /osbuilder/images
VOLUME /osbuilder/output

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
  OS_TYPE="${DEFAULT_OS_TYPE}" \
  OS_ARCH="${DEFAULT_OS_ARCH}" \
  OS_VERSION="${DEFAULT_OS_VERSION}"

ENTRYPOINT [ "/usr/local/bin/entry-point" ]