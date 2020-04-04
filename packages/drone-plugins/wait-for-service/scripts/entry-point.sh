#!/usr/bin/env sh

set -e

if [ -z "$PLUGIN_HOST" ]; then
  echo "You must supply a value for the 'host' setting."
  exit 1
fi

ATTEMPTS=0
PORT=${PLUGIN_PORT:-80}
RETRY_LIMIT=${PLUGIN_RETRY_LIMIT:-0}

echo "Waiting for service: $PLUGIN_HOST:$PORT..."
until nc -z "$PLUGIN_HOST" "$PORT" || ([ "$RETRY_LIMIT" -ne 0 ] && [ $ATTEMPTS -eq "$RETRY_LIMIT" ]); do
  if [ "$RETRY_LIMIT" = "0" ]; then
    echo Attempt $(( ++ATTEMPTS ))...
  else
    echo Attempt $(( ++ATTEMPTS )) of $RETRY_LIMIT...
  fi
  sleep 1
done

if [ $ATTEMPTS -eq $RETRY_LIMIT ]; then
   echo "Timed out waiting for service."
   exit 1
else
  echo "Service responded after $ATTEMPTS attempts."
fi