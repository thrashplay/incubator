FROM ubuntu:20.04

ARG ANDROID_PLATFORM_VERSION=30
ENV ANDROID_PLATFORM_VERSION $ANDROID_PLATFORM_VERSION

ENV ANDROID_HOME /home/android

RUN set -x \
  && : Setup user account \
  && useradd -m -u 1000 -s /bin/bash android

RUN set -x \
  && : Add installation utilities \
  && apt-get update \
  && apt-get install -y \
    unzip \
    wget \
  && : Add Java \
  && apt-get install -y \
    openjdk-8-jdk=8u265-b01-0ubuntu2~20.04 \
    openjdk-8-jdk-headless=8u265-b01-0ubuntu2~20.04

WORKDIR /home/android

RUN set -x \
  && : Add Android SDK Licenses \
  && mkdir -p licenses

COPY ./licenses/* licenses

RUN set -x \
  && : Add Android SDK \
  && mkdir -p cmdline-tools \
  && wget -qO- https://dl.google.com/android/repository/commandlinetools-linux-6609375_latest.zip > /tmp/sdktools.zip \
  && unzip /tmp/sdktools.zip -d cmdline-tools \
  && rm /tmp/sdktools.zip \
  && cmdline-tools/tools/bin/sdkmanager "build-tools;30.0.2" \
  && cmdline-tools/tools/bin/sdkmanager "emulator" \
  && cmdline-tools/tools/bin/sdkmanager "platforms;android-${ANDROID_PLATFORM_VERSION}"

ENV PATH ${PATH}:${ANDROID_HOME}/cmdline-tools/tools/bin:${ANDROID_HOME}/emulator:${ANDROID_HOME}/platform-tools
USER android