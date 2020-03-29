#!/usr/bin/env sh

export CERTIFICATES=${CERTIFICATES_FILE:-/etc/nginx/certificates.json}
if [ ! -f "$CERTIFICATES" ]; then
  echo "CERTIFICATES_FILE does not exist: $CERTIFICATES"
  exit 1
fi

if [ -z $CERTBOT_EMAIL ]; then
  echo "You must specify a CERTBOT_EMAIL environment variable, for urgent renewal and security notices."
  exit 1
fi

# start nginx
nginx
/usr/local/bin/init-certificates.sh

# do not terminate, so container continues to run
tail -f /dev/null