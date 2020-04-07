# Docker Service Wrapper

The Docker Service Wrapper acts as a Swarm-compatible wrapper for Docker images that require features
not supported in Swarm mode (such as `privileged` status, or device access). It functions by simply
deploying a Docker container directly to the host node's Docker daemon when starting, and
removing it when the service is stopped.

The idea came from [this comment](https://github.com/docker/swarmkit/issues/1244#issuecomment-394343097)
in a thread requesting device access in Swarmkit. This type of functionality is a requirement for
doing development in the IoT space, and serves other uses such as exposing access to audio devices
in a swarm.

## Disclaimer

This image is **very experimental**, and there are a whole host of things that could concievably go wrong.
Use of this software is absolutely at your own risk.
