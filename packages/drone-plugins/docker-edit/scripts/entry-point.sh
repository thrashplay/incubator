#!/usr/bin/env sh

set -e

if [ -z "$PLUGIN_SOURCE_IMAGE" ]; then
  echo "You must supply a value for the 'source_image' setting."
  exit 1
fi

if [ -z "$PLUGIN_TARGET_IMAGE" ]; then
  echo "You must supply a value for the 'target_image' setting."
  exit 1
fi

if [ -z "$PLUGIN_EDIT_COMMAND" ]; then
  echo "You must supply a value for the 'edit_command' setting."
  exit 1
fi

if [ ! -z "$PLUGIN_USERNAME" ] && [ ! -z "$PLUGIN_PASSWORD" ]; then
  echo -n "$PLUGIN_PASSWORD" | docker login --username "$PLUGIN_USERNAME" --password-stdin
else
  echo "'username' and/or 'password' setting not set, using guest mode"
fi

set -x

docker pull "$PLUGIN_SOURCE_IMAGE"
echo -n "$PLUGIN_EDIT_COMMAND" | xargs python /app/docker-copyedit.py FROM "$PLUGIN_SOURCE_IMAGE" INTO "$PLUGIN_TARGET_IMAGE" -vv
docker push "$PLUGIN_TARGET_IMAGE"