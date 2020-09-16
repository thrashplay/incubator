FROM thrashplay/android-sdk:30.0.2 as android-sdk

FROM mcr.microsoft.com/vscode/devcontainers/typescript-node:12

ARG BUILD_TOOLS_VERSION=30.0.2
ENV BUILD_TOOLS_VERSION=${BUILD_TOOLS_VERSION}
ENV ANDROID_HOME /usr/lib/android-sdk

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
    openjdk-11-jdk

# Install Android SDK
COPY --from=android-sdk /usr/lib/android-sdk /usr/lib/android-sdk
ENV PATH ${PATH}:${ANDROID_HOME}/cmdline-tools/tools/bin:${ANDROID_HOME}/platform-tools
