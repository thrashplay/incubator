#!/usr/bin/env bash

# copy config template to runtime location
cp /root/.config/rclone/rclone.conf.tmpl /root/.config/rclone/rclone.conf

# update our config file with secrets, if a secret file is specified
if [ ! -z $RCLONE_SECRETS_FILE ]; then
  while read -r line
  do
      key="${line%%=*}"
      val="${line#*=}"
      sed -i "s/\${$key}/${val}/g" /root/.config/rclone/rclone.conf
  done < "${RCLONE_SECRETS_FILE}"
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
