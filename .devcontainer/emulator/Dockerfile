FROM budtmo/docker-android-x86-10.0

COPY proxy_supervisor_config.conf /root
RUN : Adding debug proxy port forwarding... \
  && cat /root/proxy_supervisor_config.conf >> /root/supervisord.conf \
  && : Enabling hardware keyboard... \
  && echo "" >> /root/.android/avd/nexus_5_10.0.ini && echo "hw.keyboard=yes" >> /root/.android/avd/nexus_5_10.0.ini
