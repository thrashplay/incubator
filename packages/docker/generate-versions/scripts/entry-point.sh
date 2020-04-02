#!/usr/bin/env sh

if [ -z "$PLUGIN_STACK_FILES" ]; then
  echo "You must specify at least one 'stack_files' value."
  exit 1
fi

EXTRA_ARGS=
if [ ! -z "$PLUGIN_OUTPUT" ]; then
  EXTRA_ARGS="$EXTRA_ARGS --output $PLUGIN_OUTPUT"
fi

INPUT_FILES=
IFS=","
for file in $PLUGIN_STACK_FILES
do
  INPUT_FILES=" --stack-file $"
done

set -x
set -e

npx @thrashplay/config-version-helper $INPUT_FILES $EXTRA_ARGS