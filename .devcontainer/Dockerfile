ARG DOCKER_ANDROID_VERSION=10.0
ARG NODE_VERSION=12
FROM budtmo/docker-android-x86-${DOCKER_ANDROID_VERSION}:latest as android-docker

ARG DOCKER_ANDROID_VERSION
ARG NODE_VERSION
FROM mcr.microsoft.com/vscode/devcontainers/typescript-node:${NODE_VERSION}

ARG DOCKER_ANDROID_VERSION

# Install Docker CE CLI
RUN apt-get update \
    && apt-get install -y apt-transport-https ca-certificates curl gnupg2 lsb-release \
    && curl -fsSL https://download.docker.com/linux/$(lsb_release -is | tr '[:upper:]' '[:lower:]')/gpg | apt-key add - 2>/dev/null \
    && echo "deb [arch=amd64] https://download.docker.com/linux/$(lsb_release -is | tr '[:upper:]' '[:lower:]') $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list \
    && apt-get update \
    && apt-get install -y docker-ce-cli

# Install Docker Compose
RUN LATEST_COMPOSE_VERSION=$(curl -sSL "https://api.github.com/repos/docker/compose/releases/latest" | grep -o -P '(?<="tag_name": ").+(?=")') \
    && curl -sSL "https://github.com/docker/compose/releases/download/${LATEST_COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose \
    && chmod +x /usr/local/bin/docker-compose

# Install JDK
RUN set -x \
  && : Add Java \
  && apt-get install -y --no-install-recommends \
    openjdk-11-jdk \
  && apt clean all \
  && rm -rf /var/lib/apt/lists/*

# Install Android SDK
COPY --from=android-docker /root/build-tools /usr/lib/android-sdk/build-tools
COPY --from=android-docker /root/licenses /usr/lib/android-sdk/licenses
COPY --from=android-docker /root/platform-tools /usr/lib/android-sdk/platform-tools
COPY --from=android-docker /root/platforms /usr/lib/android-sdk/platforms
COPY --from=android-docker /root/system-images /usr/lib/android-sdk/system-images
COPY --from=android-docker /root/tools /usr/lib/android-sdk/tools

# Resolve 'Visual Studio Code cannot watch all files in this large workspace.' error
# https://code.visualstudio.com/docs/setup/linux#_visual-studio-code-is-unable-to-watch-for-file-changes-in-this-large-workspace-error-enospc
# RUN echo "" >> /etc/sysctl.conf && echo "fs.inotify.max_user_watches=524288" >> /etc/sysctl.conf \
#   && sudo sysctl -p

# install scripts and configuration for running emulator container
COPY emulator /etc/android-emulator
COPY scripts /usr/local/bin
RUN chmod +x /usr/local/bin/android-emulator

ENV ANDROID_HOME=/usr/lib/android-sdk \
  PATH=${PATH}:/usr/lib/android-sdk/tools/bin:/usr/lib/android-sdk/platform-tools \
  DOCKER_ANDROID_VERSION=${DOCKER_ANDROID_VERSION}
