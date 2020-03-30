#!/usr/bin/env sh

SECRETS=${SECRETS_FILE:-/run/secrets/homeassistant-secrets}

ln -s $SECRETS /config/secrets.yaml
/bin/entry.sh python3 -m homeassistant --config /config