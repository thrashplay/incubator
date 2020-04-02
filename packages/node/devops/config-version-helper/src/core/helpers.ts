import {
  attempt,
  filter,
  flow,
  get,
  getOr,
  isError,
  isNil,
  isUndefined,
  keysIn,
  map,
  negate,
  partition,
  zipObject,
} from 'lodash/fp'
import { mapIf } from '@thrashplay/fp'

import {
  ConfigEntry,
  StackDefinition,
  ContentReader,
  ConfigEntryWithError,
  VersionGetter,
  VersionedConfigEntry,
  VariableNameCreator,
  ConfigVersionsResult,
} from '../types'

type ConfigEntryWithOptionalPath = Omit<ConfigEntry, 'path'> & Partial<Pick<ConfigEntry, 'path'>>

interface ConfigEntryWithContent extends ConfigEntry {
  content: string
}

/**
 * Create a ConfigEntry for every `config` in the StackDefinition that has a 'file' property.
 */
export const getFileConfigsFromStack = (stack: StackDefinition): ConfigEntry[] => {
  const createConfigEntry = (id: string): ConfigEntryWithOptionalPath => {
    const config = get(['configs', id])(stack)
    return {
      id,
      name: config.name,
      path: config.file,
    }
  }

  const hasPath = (entry: ConfigEntryWithOptionalPath): entry is ConfigEntry => !isNil(entry.path)

  return flow(
    getOr({}, 'configs'),
    keysIn,
    map(createConfigEntry),
    filter(hasPath),
  )(stack)
}

/**
 * Uses the supplied `readContent` function to retrieve the content for a config entry, and
 * return a new config entry with the content attached.
 * 
 * Returns a ConfigEntryWithError if readContent throws an exception, otherwise returns a
 * ConfigEntryWithContent.
 */
export const addContent = (readContent: ContentReader) => (configEntry: ConfigEntry): ConfigEntryWithContent | ConfigEntryWithError => {
  const contentOrError = attempt(() => readContent(configEntry))
  return isError(contentOrError) ?
    {
      ...configEntry,
      error: contentOrError,
    } :
    {
      ...configEntry,
      content: contentOrError,
    }
}

/**
 * Uses the supplied `getVersion` function to calculate the version string for a config entry.
 * 
 * Returns a ConfigEntryWithError if getVersion throws an exception, otherwise returns a
 * VersionedConfigEntry.
 */
export const calculateVersion = (getVersion: VersionGetter) => (configEntry: ConfigEntryWithContent): VersionedConfigEntry | ConfigEntryWithError => {
  const versionOrError = attempt(() => getVersion(configEntry.content, configEntry))
  return isError(versionOrError) ?
    {
      ...configEntry,
      error: versionOrError,
    } :
    {
      ...configEntry,
      version: versionOrError,
    }
}

/**
 * Converts an array of config entries (either versioned, or with errors) into a ConfigVersionsResult.
 */
export const createResult = (getVariableName: VariableNameCreator) => (configEntries: (VersionedConfigEntry | ConfigEntryWithError)[]): ConfigVersionsResult => {
  const hasError = (configEntry: VersionedConfigEntry | ConfigEntryWithError): configEntry is ConfigEntryWithError => flow(
    get('error'),
    negate(isUndefined)
  )(configEntry)

  const createVariableInfo = (configEntry: VersionedConfigEntry) => ({
    name: getVariableName(configEntry),
    version: configEntry.version,
  })

  return flow( 
    mapIf(negate(hasError), createVariableInfo),
    partition(hasError),
    zipObject(['invalidConfigs', 'variables']),
  )(configEntries)
}
