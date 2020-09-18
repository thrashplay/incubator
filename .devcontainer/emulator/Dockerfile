ARG DOCKER_ANDROID_VERSION=10.0
FROM budtmo/docker-android-x86-${DOCKER_ANDROID_VERSION}

COPY proxy_supervisor_config.conf /root

RUN : Adding debug proxy port forwarding... \
  && cat /root/proxy_supervisor_config.conf >> /root/supervisord.conf \
  && : Adding custom emulator config... \
  && mkdir -p /root/android_emulator \
  && mkdir -p /root/.android/avd

COPY config.ini /root/android_emulator/config.ini
COPY nexus_5_10.0.ini /root/.android/avd/nexus_5_10.0.ini