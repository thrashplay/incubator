FROM qmcgaw/ddns-updater:latest

COPY scripts/entry-point.sh /usr/local/bin
VOLUME /updater/data

ENTRYPOINT [ "/usr/local/bin/entry-point.sh" ]