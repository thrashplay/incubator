# Swarm Management

The Swarm Management plugin can be used to create and update stacks and other resources in a Docker
swarm. Created resources must be removed manually if desired, because this plugin does not perform
automatic deletion of swarm resources.

For more information on the Python application used to manage swarm resources, and the configuration
file used to describe those resources, see: https://github.com/DIPSAS/SwarmManagement

## Examples

The following pipeline configuration uses the Swarm Management plugin to publish a swarm configuration:

```yaml
kind: pipeline
name: default

steps:
- name: deploy
  image: thrashplay/swarm-management
  settings:
    docker_host: docker-swarm-manager.example.com:2376
    docker_cacert:
      from_secret: DOCKER_CACERT
    docker_cert:
      from_secret: DOCKER_CERT
    docker_key:
      from_secret: DOCKER_KEY
    configuration_file: repo/path/to/swarm.management.yaml
    use_tls: true
```

## Parameter Reference

- **configuration_file**   
   url of the Swarm Management configuration Yaml (defaults to swarm.management.yml)

- **docker_host**   
   url of the Docker host, as passed to the -H argument to Docker (defaults to tcp://localhost:2376)

- **docker_cacert**   
   path to the cacert file to use with Docker TLS

- **docker_cert**   
   path to the TLS certificate file to use with Docker

- **docker_key**   
  path to the TLS key file to use with Docker

- **use_tls**   
  whether the Docker connection should use TLS (if true, `docker_cacert`, `docker_cert`, and `docker_key` are required)