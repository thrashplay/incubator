#!/usr/bin/env sh

TIMEOUT=${STOP_TIMEOUT:-10}

start_container () {
  echo "Starting container..."
  docker run --cidfile /var/run/service-wrapper/cid "$@"
}

stop_container () {
  CID=`cat /var/run/service-wrapper/cid`

  echo "Stopping container ${CID}..."
  docker stop --time ${TIMEOUT} ${CID} || true
  echo "Removing container ${CID}..."
  docker rm ${CID} || true
  exit 0
}

trap "stop_container" 15

start_container
/usr/local/bin/pause
