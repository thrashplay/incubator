#!/usr/bin/env node

import fs from 'fs'
import path from 'path'

import yaml from 'js-yaml'
import yargs from 'yargs'
import { forEach, flow, join, map } from 'lodash/fp'

import { ConfigEntryWithError, ConfigVersionsResult } from './helpers'

import { getConfigVersionVariables } from './index'

interface Arguments {
  stackYamlPath: string
}

const handleErrors = ({ invalidConfigs }: ConfigVersionsResult) => {
  if (invalidConfigs.length == 1) {
    console.error('Failed to generate version for config entry:', invalidConfigs[0].id)
    throw invalidConfigs[0].error
  } else if (invalidConfigs.length > 1) {
    console.error('Multiple errors generating config entries:')
    forEach((config: ConfigEntryWithError) => {
      console.error(`  ${config.id}: ${config.error.message}`)
    })(invalidConfigs)
    throw new Error('Config version calculation failed.')
  }
}

const getStackRelativePath = (stackPath: string, configPath: string) => path.resolve(path.resolve(stackPath, '..'), configPath)

const getEnvString = (stackYamlPath: string) => {
  const stackYaml = fs.readFileSync(stackYamlPath, 'utf8')
  const stack = yaml.safeLoad(stackYaml)

  const result = getConfigVersionVariables(stack, {
    getConfigContent: ({ path }) => fs.readFileSync(getStackRelativePath(stackYamlPath, path), 'utf8'),
  })

  handleErrors(result)

  return flow(
    map(({ name, version }) => `${name}=${version}`),
    join('\n')
  )(result.variables)
}

const main = ({ stackYamlPath }: Arguments) => {
  const envString = getEnvString(stackYamlPath)
  console.log('Calculated config versions:')
  console.log(envString)
  fs.writeFileSync(getStackRelativePath(stackYamlPath, 'config-versions.env'), envString)
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

     