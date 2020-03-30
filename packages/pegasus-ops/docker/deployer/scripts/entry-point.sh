#!/usr/bin/env sh

mkdir -p ~/.docker
echo "$PLUGIN_DOCKER_CACERT" > ~/.docker/ca.pem
echo "$PLUGIN_DOCKER_CERT" > ~/.docker/cert.pem
echo "$PLUGIN_DOCKER_KEY" > ~/.docker/key.pem

export DOCKER_HOST=${PLUGIN_DOCKER_HOST:-tcp://localhost:2376}
export DOCKER_TLS_VERIFY=1

/bin/sh ./packages/pegasus-ops/bin/deploy-services