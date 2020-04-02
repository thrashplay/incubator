FROM python:3.8-alpine

RUN apk update && \
    apk add docker-cli && \
    pip install --upgrade SwarmManagement

COPY scripts/entry-point.sh /usr/local/bin
RUN chmod +x /usr/local/bin/entry-point.sh

ENTRYPOINT [ "/usr/local/bin/entry-point.sh" ]