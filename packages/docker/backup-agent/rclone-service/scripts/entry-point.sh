#!/usr/bin/env bash

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
