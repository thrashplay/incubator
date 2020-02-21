import { promises as fsp } from 'fs'
import path from 'path'
import os from 'os'

import Ajv from 'ajv'
import { assign, get, flow, join, map, size } from 'lodash'

import { TsConfig } from './ts-config'
import tsconfigSchema from './schemas/tsconfig.schema.json'

const ajv = new Ajv({ 
  allErrors: true,
  meta: false,
  schemaId: 'id',
})
ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-04.json'))

const validateTsconfig = ajv.compile(tsconfigSchema)

const getErrorMessage = (error: Ajv.ErrorObject) => {
  switch (error.keyword) {
    case 'additionalProperties':
      return `has unrecognized property: "${error.dataPath}.${get(error, 'params.additionalProperty')}"`

    case 'enum':
      return `${error.dataPath} must equal one of: ${get(error, 'params.allowedValues')}`

    case 'type':
      return `${error.dataPath} ${error.message}`

    default:
      return error.message
  }
}



/////////////////
// FUNCTIONAL
/////////////////

export const loadTsConfigPure = flow(
  
)


/////////////////
// END
/////////////////



/**
 * Loads a `TypescriptConfiguration` from a specified path.
 * 
 * If the path is a directory, then a file named `tsconfig.json` will be used to load the configuration.
 * Otherwise, the path is assumed to be the name of a file to load.
 * 
 * If `flatten` is true, then all parent tsconfig files specified via `extends` will be loaded, and the 
 * settings will be merged into the result. In this case, the `extends` property will be undefined 
 * on the returned option. If `flatten` is false, then only the settings directly specified at the given 
 * path will be loaded.
 * 
 * This method returns a Promise that resolves to the requested `TypescriptConfiguration`, and rejects
 * if the `path` is invalid or another error occurs.
 */
export const loadTsConfig = (tsconfigPath: string, _flatten: boolean = false): Promise<TsConfig> => {
  return fsp.stat(tsconfigPath)
    .catch(() => {
      throw assign(new Error(`tsconfig path does not exist: ${tsconfigPath}`), { code: 'ENOENT' })
    })
    .then((stats) => {
      return stats.isDirectory()
        ? loadTsconfigFromDirectory(tsconfigPath)
        : loadTsconfigFromFile(tsconfigPath)
    })
}

/**
 * Helper function that loads a `tsconfig.json` from the specified directory, if it exists and is a regular file. If the
 * file does not exist, or refers to a directory, then the result is a rejected promise. Otherwise, the result will resolve
 * to the contents of that file, parsed as a `TsConfig` instance.
 */
const loadTsconfigFromDirectory = (directory: string) => {
  const tsconfigPath = path.join(directory, 'tsconfig.json')
  return fsp.stat(tsconfigPath)
    .catch(() => {
      throw assign(new Error(`tsconfig path does not exist: ${tsconfigPath}`), { code: 'ENOENT' })
    })
    .then((stats) => {
      return stats.isDirectory()
        ? Promise.reject(assign(new Error(`Found directory named 'tsconfig.json' instead of JSON file: ${tsconfigPath}`), { code: 'EISDIR' }))
        : loadTsconfigFromFile(tsconfigPath)
    })
}

/**
 * Helper function that loads a `tsconfig.json` from the specified file. This function does not check that the file exists, and
 * simply attempts to read it. If the file does not exist, then the result is a rejected promise. Otherwise, the result will resolve
 * to the contents of that file, parsed as a `TsConfig` instance.
 */
const loadTsconfigFromFile = (file: string) => {
  return fsp.readFile(file, 'utf8')
    .then((data) => JSON.parse(data))
    .catch((err) => {
      throw new Error(`'${file}' was not valid JSON: ${err.message}`)
    })
    .then((parsedJson) => {
      const valid = validateTsconfig(parsedJson)
      if (!valid) {
        const separator = size(validateTsconfig.errors) > 1 ? ` ${os.EOL}` : ' '
        throw new Error(`'${file}' is not a valid tsconfig.json file:${separator}${join(map(validateTsconfig.errors, getErrorMessage), os.EOL)}`)
      }

      return parsedJson
    })
}
