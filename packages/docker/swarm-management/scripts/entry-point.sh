#!/usr/bin/env sh

set -e

if [ "$PLUGIN_USE_TLS" = "true" ]; then
  VALID=true

  if [ -z "$PLUGIN_DOCKER_CACERT" ]; then
    VALID=false
  fi
  if [ -z "$PLUGIN_DOCKER_CERT" ]; then
    VALID=false
  fi
  if [ -z "$PLUGIN_DOCKER_KEY" ]; then
    VALID=false
  fi

  if [ "$VALID" != "true" ]; then
    echo "If use_tls == true, you must supply the following: docker_cacert, docker_cert, and docker_key"
    exit 1
  fi

  mkdir -p ~/.docker
  echo "$PLUGIN_DOCKER_CACERT" > ~/.docker/ca.pem
  echo "$PLUGIN_DOCKER_CERT" > ~/.docker/cert.pem
  echo "$PLUGIN_DOCKER_KEY" > ~/.docker/key.pem

  export DOCKER_TLS_VERIFY=1
fi

export DOCKER_HOST=${PLUGIN_DOCKER_HOST:-tcp://localhost:2376}
CONFIGURATION_FILE=${PLUGIN_CONFIGURATION_FILE:-swarm.management.yml}

set -x
swm -start -f $CONFIGURATION_FILE