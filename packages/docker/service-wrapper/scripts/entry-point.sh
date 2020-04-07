#!/usr/bin/env sh

start_container () {
  echo "Starting container!"
}

stop_container () {
  echo "Stopping container!"
  exit 0
}

trap "stop_container" 15

start_container
/usr/local/bin/pause
