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

args=()
args+=( 'rcd' )
args+=( '--rc-addr=0.0.0.0:5572' )
args+=( '--rc-web-gui' )
args+=( '--rc-web-gui-no-open-browser' )

if [[ -n "${HTPASSWD_FILE}" ]]; then
  args+=( '--rc-htpasswd' )
  args+=( "${HTPASSWD_FILE}" )
fi

rclone "${args[@]}"
