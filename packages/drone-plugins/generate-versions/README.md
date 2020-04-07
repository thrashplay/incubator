# Generate Config Versions

The Generate Config Versions plugin can be used to generate hash-based version strings for Docker Swarm
configs and secrets. These version strings can then be used to generate unique-enough names for
these resources, allowing them to be rotated in an automated fashion. For more information on the 
motivation for this plugin, and how it works, see the Node.js library it uses: 
https://github.com/thrashplay/incubator-node/tree/master/packages/node/devops/config-version-helper.

## Overview

This plugin provides a way to execute the `@thrashplay/config-version-helper` CLI in a Drone
pipeline. As such, most of the configuration options map directly to command line arguments for that
tool. These options cane be explored in greater depth here: 
https://github.com/thrashplay/incubator-node/tree/master/packages/node/devops/config-version-helper.

## Basic Usage

The following example shows input and output files for the most common use case -- generating
an environment file for every Docker compose Yaml file in a list.

```yaml
kind: pipeline
name: default

steps:
- name: generate-versions
  image: thrashplay/generate-versions
  settings:
    stack_files: 
      - /path/to/first/docker-compose.yaml
      - /path/to/second/docker-compose.yaml
      - /path/to/third/docker-compose.yaml
    output: versions.env
```

## Parameter Reference

- **output**   
   name of the file to save environment variables in, defaults to `.env` (--output CLI arg)

- **stack_files**   
   array of paths to docker-compose files to process (--stack-file args)
