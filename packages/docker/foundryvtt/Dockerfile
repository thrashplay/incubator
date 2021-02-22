FROM alpine:3.13.2 AS install

ARG DOWNLOAD_URL
RUN \
  : "${DOWNLOAD_URL:?DOWNLOAD_URL for the Foundry VTT installer must be provided.}"

# download app
RUN wget -O /tmp/foundryvtt.zip "${DOWNLOAD_URL}" && \
  unzip /tmp/foundryvtt.zip -d /tmp/foundryvtt

FROM node:14.15.5-alpine3.13

EXPOSE 30000

ENV FOUNDRY_VTT_DATA_PATH=/srv/foundryvtt

# setup non-root user and data direcotry
RUN adduser foundryvtt --disabled-password --gecos "Foundry VTT" --uid 1001 && \
  mkdir -p /home/foundryvtt/app && \
  mkdir -p /srv/foundryvtt && \
  chown foundryvtt.foundryvtt /srv/foundryvtt

# setup entry point
COPY scripts/* /home/foundryvtt/
RUN chmod +x /home/foundryvtt/start-foundry && \
  chmod +x /home/foundryvtt/encrypt-admin-password.js

USER foundryvtt
WORKDIR /home/foundryvtt

# install the app
COPY --from=install /tmp/foundryvtt/ /home/foundryvtt/app
ENTRYPOINT [ "/home/foundryvtt/start-foundry" ] 