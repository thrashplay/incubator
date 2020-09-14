FROM ubuntu:20.04

ARG ANDROID_PLATFORM_VERSION=30
ARG BUILD_TOOLS_VERSION=30.0.2
ENV ANDROID_PLATFORM_VERSION=${ANDROID_PLATFORM_VERSION} \
  BUILD_TOOLS_VERSION=${BUILD_TOOLS_VERSION}

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
    openjdk-8-jdk-headless=8u265-b01-0ubuntu2~20.04

WORKDIR /usr/lib/android-sdk

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
  && cmdline-tools/tools/bin/sdkmanager "build-tools;${BUILD_TOOLS_VERSION}" \
  && cmdline-tools/tools/bin/sdkmanager "platforms;android-${ANDROID_PLATFORM_VERSION}"

ENV PATH ${PATH}:${ANDROID_HOME}/cmdline-tools/tools/bin:${ANDROID_HOME}/platform-tools