ARG ANDROID_DOCKER_VERSION=10.0
FROM budtmo/docker-android-x86-${ANDROID_DOCKER_VERSION}:latest as android-docker

ARG ANDROID_DOCKER_VERSION
FROM ubuntu:20.04

WORKDIR /usr/lib/android-sdk

ENV ANDROID_HOME /usr/lib/android-sdk

RUN set -x \
  && : Add installation utilities \
  && apt-get update \
  && apt-get install -y \
    unzip \
    wget \
  && : Add Java \
  && apt-get install -y \
    openjdk-8-jdk=8u265-b01-0ubuntu2~20.04 \
    openjdk-8-jdk-headless=8u265-b01-0ubuntu2~20.04 \
  && apt clean all \
  && rm -rf /var/lib/apt/lists/*

COPY --from=android-docker /root/build-tools /usr/lib/android-sdk/build-tools
COPY --from=android-docker /root/licenses /usr/lib/android-sdk/licenses
COPY --from=android-docker /root/platform-tools /usr/lib/android-sdk/platform-tools
COPY --from=android-docker /root/platforms /usr/lib/android-sdk/platforms
COPY --from=android-docker /root/system-images /usr/lib/android-sdk/system-images
COPY --from=android-docker /root/tools /usr/lib/android-sdk/tools

ENV PATH ${PATH}:${ANDROID_HOME}/tools/bin:${ANDROID_HOME}/platform-tools

