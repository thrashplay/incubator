import fs from 'fs'
import path from 'path'

import { forEach } from 'lodash/fp'

import { createEnvFile } from '../fs'
import { ConfigVersionVariable, ConfigEntry } from '../types'

export interface Arguments {
  // the output file to generate, relative to the docker-compose Yaml
  output: string

  // an array of absolute paths to docker-compose.yaml files for the stack(s) to process
  stackFiles: string[]
}

export const execute = (
  { output, stackFiles }: Arguments,
  log: (message?: any, ...optionalParams: any[]) => void = console.log
) => {
  const logVersion = (version: ConfigVersionVariable) => {
    log(`  ${version.name}=${version.version}`)
  }

  const processStackFile = (stackFile: string) => {
    const getStackRelativePath = (configPath: string) => path.resolve(path.dirname(stackFile), configPath)

    createEnvFile(stackFile, getStackRelativePath(output))
      .then((result) => {
        log(`${stackFile} => ${output}...`)
        forEach(logVersion)(result.variables)
        log()
      })
  }

  log()
  forEach(processStackFile)(stackFiles)
}