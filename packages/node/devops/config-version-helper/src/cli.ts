#!/usr/bin/env node

import path from 'path'

import yargs from 'yargs'
import { map, noop } from 'lodash/fp'
import { getAbsolutePath } from '@thrashplay/fs-utils/src'

import { GenerateFromStackYaml } from './commands'

interface Arguments {
  f: string[]
  o: string
  q: boolean
}

const createLogger = ({ q: quiet }: Arguments) => quiet ? noop : console.log

yargs
  .scriptName('npx @thrashplay/config-version-helper')
  .command({
    command: '*',
    builder: (yargs) => 
      yargs.options({
        f: {
          alias: 'stack-file',
          coerce: map(path.resolve),
          demandOption: true,
          description: 'The docker-compose file to process; may be specified multiple times',
          normalize: true,
          type: 'array',
        },
        o: {
          alias: 'output',
          default: '.env',
          defaultDescription: '.env',
          description: 'The name of the file to save environment variables in, relative to the stack Yaml',
          normalize: true,
          type: 'string',
        },
        q: {
          alias: 'quiet',
          default: false,
          description: 'Disable all non-error output',
          type: 'boolean',
        },
      }),
    describe: 'Generate version information from a stack\'s docker-compose.yaml file',
    handler: (args: Arguments) => {
      const { f: stackFiles, o: output } = args
      GenerateFromStackYaml.execute({
        output,
        stackFiles,
      }, createLogger(args))
    },
  })
  .argv

     