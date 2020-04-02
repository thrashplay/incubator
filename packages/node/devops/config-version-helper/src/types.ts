export interface ConfigEntry {
  id: string
  name?: string
  path: string
}

export interface ConfigEntryWithError extends ConfigEntry {
  error: Error
}

export interface VersionedConfigEntry extends ConfigEntry {
  version: string
}

/**
 * Reads the content for a config entry.
 */
export type ContentReader = (configEntry: ConfigEntry) => string

/**
 * Calculates the version to use for a config entry and its content.
 */
export type VersionGetter = (content: string, configEntry: ConfigEntry) => string

/**
 * Creates a variable name to use for the specified config entry.
 */
export type VariableNameCreator = (configEntry: VersionedConfigEntry) => string

export type StackDefinition = object

/**
 * Object mapping a version variable name for a stack's config to the version string 
 * for that config.
 */
export interface ConfigVersionVariable {
  name: string
  version: string
}

export interface ConfigVersionsResult {
  variables: ConfigVersionVariable[]
  invalidConfigs: ConfigEntryWithError[]
}