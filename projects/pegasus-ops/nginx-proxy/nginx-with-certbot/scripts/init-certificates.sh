#!/usr/bin/env sh

if [ "$CERTBOT_STAGING" = "true" ]; then
  CERTBOT_CLI_OPTS=--test-cert 
else
  CERTBOT_CLI_OPTS=
fi

CERTBOT_CLI_OPTS="$CERTBOT_CLI_OPTS --nginx --redirect --renew-with-new-domains --non-interactive --agree-tos --email $CERTBOT_EMAIL $EXTRA_CERTBOT_OPTS"

# for each configured certificate, run cerbot
cat $CERTIFICATES \
  | jq -r '. | to_entries | map("--cert-name \(.key) --domains \(.value | join(","))") | .[]' \
  | awk 1 - \
  | while read line; do
    certbot $CERTBOT_CLI_OPTS $line
  done
