#!/bin/bash

set -e

FINAL_UID=${USER_ID:-9999}
FINAL_GID=${GROUP_ID:-9999}

# install sdk components as root
echo "y" | sdkmanager "${AVD_SYSTEM_IMAGE}"
# set home direcotry to have correct permissions
mkdir -p "${HOME}"
chown -hR "${FINAL_UID}:${FINAL_GID}" "${HOME}"

# change to non-privileged user
exec gosu "${FINAL_UID}:${FINAL_GID}" /usr/local/bin/start-emulator.sh "$@"