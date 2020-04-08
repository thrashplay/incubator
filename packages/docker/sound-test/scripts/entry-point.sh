#!/usr/bin/env sh

aplay --help
aplay -l
aplay -L
aplay -vv /srv/audio/test_piano.wav

tail -f /dev/null