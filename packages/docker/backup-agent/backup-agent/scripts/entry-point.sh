#!/usr/bin/env bash

until /usr/local/bin/rclone_exec noop; do
  >&2 echo "rclone service is unavailable - sleeping"
  sleep 1
done

if [[ -n "${RCLONE_OPTIONS_FILE}" ]]; then
  OPTIONS_CONTENT=$(<${RCLONE_OPTIONS_FILE})
  echo "Setting rclone options: ${OPTIONS_CONTENT}"
  /usr/local/bin/rclone_exec options/set --json "${OPTIONS_CONTENT}"
fi

exec /usr/local/bin/supercronic /etc/supercronic/crontab
