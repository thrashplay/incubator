#!/usr/bin/env node

import path from 'path'

import yargs from 'yargs'

import { createEnvFile } from './fs'

interface Arguments {
  stackYamlPath: string
}

const main = ({ stackYamlPath }: Arguments) => {
  createEnvFile(stackYamlPath, path.resolve(path.dirname(stackYamlPath), 'config-versions.env'))
}

yargs.command(
  '$0 <stack-yaml-path>',
  'Generate versions file for a stack definition', 
  (yargs) => {
    yargs.positional('stack-yaml-path', {
      normalize: true,
      coerce: path.resolve,
    })
  }, 
  main).argv

     