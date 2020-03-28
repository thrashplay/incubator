#!/usr/bin/env sh

CONFIG=${CONFIG_FILE:-/ddns/config.json}

cp ${CONFIG} /updater/data/config.json

# update our JSON config with secrets, if a secret file is specified
if [ ! -z $CONFIG_SECRETS_FILE ]; then
  awk 1 $CONFIG_SECRETS_FILE | while IFS== read -r name value
  do
    sed -i "s/\$$name/$value/g" /updater/data/config.json
  done
fi

# run the base updater app
/updater/app