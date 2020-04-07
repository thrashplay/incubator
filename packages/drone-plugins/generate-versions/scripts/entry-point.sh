#!/usr/bin/env sh

set -e

if [ -z "$PLUGIN_STACK_FILES" ]; then
  echo "You must specify at least one 'stack_files' value."
  exit 1
fi

set -- ""
if [ ! -z "$PLUGIN_OUTPUT" ]; then
  set -- "$@" --output "${PLUGIN_OUTPUT}"
fi

INPUT_FILES=
IFS=","
for file in $PLUGIN_STACK_FILES
do
  set -- "$@" --stack-file "${file}"
done

set -x
npx @thrashplay/config-version-helper@next "$@"