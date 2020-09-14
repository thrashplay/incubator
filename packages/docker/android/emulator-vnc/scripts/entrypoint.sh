#!/bin/bash

set -e

FINAL_UID=${USER_ID:-9999}
FINAL_GID=${GROUP_ID:-9999}

adduser \
  --home "${EMULATOR_HOME}" \
  --uid "${FINAL_UID}" \
  --gid "${FINAL_GID}" \
  --gecos '' \
  --disabled-login \
  emulator

# change to non-privileged user
exec gosu "${FINAL_UID}:${FINAL_GID}" sh -c "/usr/local/bin/start-emulator.sh $@"