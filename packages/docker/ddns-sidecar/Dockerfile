FROM qmcgaw/ddns-updater:v1

COPY scripts/entry-point.sh /usr/local/bin
USER root
RUN chmod +x /usr/local/bin/entry-point.sh
USER 1000

VOLUME /updater/data

ENTRYPOINT [ "/usr/local/bin/entry-point.sh" ]
