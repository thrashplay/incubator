#!/usr/bin/env bash

ATTEMPTS=0
RETRY_LIMIT=60

echo "Waiting for rclone service..."
until /usr/local/bin/rclone_exec rc/noop || ([ "$RETRY_LIMIT" -ne 0 ] && [ $ATTEMPTS -eq "$RETRY_LIMIT" ]); do
  if [ "$RETRY_LIMIT" = "0" ]; then
    >&2 echo Attempt $(( ++ATTEMPTS ))...
  else
    >&2 echo Attempt $(( ++ATTEMPTS )) of $RETRY_LIMIT...
  fi
  sleep 1
done

if [ $ATTEMPTS -eq $RETRY_LIMIT ]; then
   echo "Timed out waiting for rclone service."
   exit 1
else
  echo "rclone service responded after $ATTEMPTS attempts."
fi

if [[ -n "${RCLONE_OPTIONS_FILE}" ]]; then
  OPTIONS_CONTENT=$(<${RCLONE_OPTIONS_FILE})
  echo "Setting rclone options: ${OPTIONS_CONTENT}"
  /usr/local/bin/rclone_exec options/set --json "${OPTIONS_CONTENT}"
fi

exec /usr/local/bin/supercronic /etc/supercronic/crontab
