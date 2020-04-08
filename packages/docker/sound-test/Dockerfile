FROM alpine:3.11.5

# make a small program that pauses indefinitely
RUN apk update && apk add --no-cache alsa-utils alsa-lib alsaconf
RUN addgroup root audio

COPY data/test_piano.wav /srv/audio/test_piano.wav
COPY scripts/entry-point.sh /usr/local/bin
RUN chmod +x /usr/local/bin/entry-point.sh

ENTRYPOINT [ "/usr/local/bin/entry-point.sh" ]