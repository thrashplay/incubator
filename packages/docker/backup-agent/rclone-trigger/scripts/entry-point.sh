#!/usr/bin/env bash

# copy config template to runtime location
cp /root/.config/rclone/rclone.conf.tmpl /root/.config/rclone/rclone.conf

# update our config file with secrets, if a secret file is specified
if [ ! -z $RCLONE_SECRETS_FILE ]; then
  awk 1 $RCLONE_SECRETS_FILE | while IFS== read -r name value
  do
    sed -i "s/\${$name}/$value/g" /root/.config/rclone/rclone.conf
  done
fi

if [[ -n "${RCLONE_OPTIONS_FILE}" ]]; then
  OPTIONS_CONTENT=$(<${RCLONE_OPTIONS_FILE})
  echo "Setting rclone options: ${OPTIONS_CONTENT}"
  /usr/local/bin/rclone_exec options/set --json "${OPTIONS_CONTENT}"
fi

exec /usr/local/bin/supercronic /etc/supercronic/crontab
