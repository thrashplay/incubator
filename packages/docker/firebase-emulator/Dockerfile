FROM node:10.20.1-buster as install-emulator

RUN yarn global add firebase-tools && \
  firebase setup:emulators:database && \
  firebase setup:emulators:firestore && \
  firebase setup:emulators:pubsub

FROM node:10.20.1-buster

# Install OpenJDK 11
RUN apt-get update && \
    apt-get install -y openjdk-11-jdk && \
    apt-get clean

# copy emulator files into image
COPY --from=install-emulator /root/.cache/firebase/emulators /root/.cache/firebase/

ENTRYPOINT [ "/usr/local/bin/firebase" ]