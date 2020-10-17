import fs from 'fs'
import path from 'path'

import { getAbsolutePath, fileExists } from '@thrashplay/fs-utils'
import yaml from 'js-yaml'
import { flow, isFunction, isString, map, join, forEach } from 'lodash/fp'

import { ConfigVersionVariableOptions, getConfigVersionVariables } from '../core'
import { ConfigVersionsResult, StackDefinition, ConfigEntryWithError, ConfigEntry } from '../types'

export type StackFileVersionVariableOptions = Omit<ConfigVersionVariableOptions, 'getConfigContent'>

type EnvFilePathProvider = (stackYamlPath: string) => string
const defaultEnvFilePathProvider = (stackYamlPath: string) => getAbsolutePath(stackYamlPath, '.env')

/**
 * Reads a Docker Stack definition file and generates version identifier variables for the configs it
 * contains. These variables are written to the specified `envFilePath`.
 * 
 * @param stackYamlPath absolute file path for the stack Yaml file
 * @param envFilePath absolute file path for where the variables should be written
 * @param options the version variable creation options to use
 */
export function createEnvFile(
  stackYamlPath: string,
  envFilePath: string,
  options?: StackFileVersionVariableOptions): Promise<ConfigVersionsResult>

/**
 * Reads a Docker Stack definition file and generates version identifier variables for the configs it
 * contains. These variables are written to the path provided by the supplied `envFilePathProvider`
 * function, which is given the stack file's path as an argment.
 * 
 * If no provider is supplied, then an `.env` file is created in the same directory as the input 
 * Yaml.
 * 
 * @param stackYamlPath absolute file path for the stack Yaml file
 * @param envFilePath absolute file path for where the variables should be written
 * @param options the version variable creation options to use
 */
export function createEnvFile(
  stackYamlPath: string,
  envFilePathProvider?: EnvFilePathProvider,
  options?: StackFileVersionVariableOptions): Promise<ConfigVersionsResult>

/**
 * Reads a Docker Stack definition Yaml file and generates version identifier variables for the configs it
 * contains. These variables are written to a file called `.env` in the same directory as the 
 * input Yaml.
 * 
 * @param stackYamlPath absolute file path for the stack Yaml file
 * @param options the version variable creation options to use
 */
export function createEnvFile(
  stackYamlPath: string,
  options?: StackFileVersionVariableOptions): Promise<ConfigVersionsResult>

export function createEnvFile(
  stackYamlPath: string,
  envFilePathOrProviderOrOptions: string | EnvFilePathProvider | StackFileVersionVariableOptions = defaultEnvFilePathProvider,
  options: StackFileVersionVariableOptions = {},
): Promise<ConfigVersionsResult> {

  const getStackRelativePath = (configPath: string) => path.resolve(path.dirname(stackYamlPath), configPath)
  const getConfigContent = ({ path }: ConfigEntry) => fs.readFileSync(getStackRelativePath(path), 'utf8')

  let optionsArg = options
  if (!isString(envFilePathOrProviderOrOptions) && !isFunction(envFilePathOrProviderOrOptions)) {
    optionsArg = envFilePathOrProviderOrOptions
  }
  
  const promiseToExist = (path: string) => fileExists(path)
    .then((exists) => {
      if (!exists) {
        throw new Error('Invalid stack definition Yaml path: ' + path)
      }

      return path
    })

  const loadYaml = (path: string) => fs.promises.readFile(path, { encoding: 'utf8' })

  const parseYaml = (yamlString: string) => yaml.safeLoad(yamlString)

  const calculateVersions = (options: StackFileVersionVariableOptions) =>
    (stack: StackDefinition) => getConfigVersionVariables(stack, {
      ...options,
      getConfigContent,
    })

  const assertValidResults = (results: ConfigVersionsResult) => {
    const { invalidConfigs } = results
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

    return results
  }

  const getOutputPathFromArgs = () => {
    if (isString(envFilePathOrProviderOrOptions)) {
      return envFilePathOrProviderOrOptions
    } else if (isFunction(envFilePathOrProviderOrOptions)) {
      return envFilePathOrProviderOrOptions(stackYamlPath)
    } else {
      return getStackRelativePath('.env')
    }
  }

  const writeEnvFile = (versions: ConfigVersionsResult) => {
    const outputPath = getOutputPathFromArgs()

    const result = flow(
      map(({ name, version }) => `${name}=${version}`),
      join('\n'),
    )(versions.variables)

    return fs.promises.mkdir(path.dirname(outputPath), { recursive: true })
      .then(() => fs.promises.writeFile(outputPath, result, { encoding: 'utf8' }))
      .then(() => versions)
  }

  return promiseToExist(stackYamlPath)
    .then(loadYaml)
    .then(parseYaml)
    .then(calculateVersions(optionsArg))
    .then(assertValidResults)
    .then(writeEnvFile)
}