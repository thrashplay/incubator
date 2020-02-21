import { get, isNil, join, map } from 'lodash'
import { TsConfig, loadTsConfig } from '@thrashplay/tsconfig-utils'
import { PackageJson, Project, PackageConfig } from '@thrashplay/project-utils'

/**
 * Loads a `TypescriptConfiguration` from a specified path.
 * 
 * If the path is a directory, then a file named `tsconfig.json` will be used to load the configuration.
 * Otherwise, the path is assumed to be the name of a file to load.
 * 
 * This method returns a Promise that resolves to the requested `TypescriptConfiguration`, and rejects
 * if the `path` is invalid or another error occurs.
 */
export type TsConfigLoader = (tsconfigPath: string) => Promise<TsConfig>
const defaultTsConfigLoader = (tsconfigPath: string) => loadTsConfig(tsconfigPath, true)

/**
 * Metadata used to generate TS configuration for a TypeScript package
 */
export interface TypescriptPackage {
  /** directory where the tsconfig.json is to be written, used for calculating relative paths; defaults to projectRoot */
  outputDirectory?: string,
  
  /** parsed package.json for the project */
  packageJson: PackageJson,
  
  /** root directory of the project, where the package.json resides */
  projectRoot: string,

  /** any TypeScript options supplied by the user for this project */
  userTsConfig?: TsConfig,
}

export interface TsConfigs {
  defaults: TsConfig
}

const withBasePath = (relativePath: string, basePath?: string) => isNil(basePath) ? relativePath : `${basePath}/${relativePath}`

const getCompilerOptions = (basePath?: string) => ({
  declaration: true,
  declarationDir: withBasePath('lib', basePath),
  outDir: withBasePath('lib', basePath),
  rootDir: withBasePath('src', basePath),
  tsBuildInfoFile: withBasePath('tsconfig.tsbuildinfo'),
})

const getIncludePaths = (userTsConfig: TsConfig, basePath?: string) => {
  const includeExtensions = []
  const allowJs = get(userTsConfig, ['compilerOptions', 'allowJs'])
  const allowJsx = get(userTsConfig, ['compilerOptions', 'jsx'])
  const allowJson = get(userTsConfig, ['compilerOptions', 'resolveJsonModule'])

  includeExtensions.push('ts')
  if (allowJs) {
    includeExtensions.push('js')
  }
  if (allowJsx) {
    includeExtensions.push('tsx')
  }
  if (allowJs && allowJsx) {
    includeExtensions.push('jsx')
  }
  if (allowJson) {
    includeExtensions.push('json')
  }

  return map(includeExtensions, (extension) => withBasePath(`src/**/*.${extension}`, basePath))
}

/**
 * Gets the user-supplied TsConfig for a package. The user-supplied TsConfig is retrieved by reading the contents
 * of the 'tsconfig.json' file in the package directory, if such a file exists. If there is no such file, the result
 * will be an empty configuration. If the file exists, but is invalid for some reason, this function will return a
 * rejected promise.
 * 
 * @param packageConfig 
 */
export const getUserTsConfig = (packageConfig: PackageConfig, tsconfigLoader: TsConfigLoader = defaultTsConfigLoader) => {
  return tsconfigLoader(packageConfig.directory)
}

/**
 * Gets the tsconfig objects for a package.
 * 
 * @param project the parent project containing the package, used for reference lookups
 * @param packageConfig the configuration of the package to generate TsConfigs for
 * @param outputDirectory directory where the configs will be written, defaults to the directory of the packageConfig
 * @return a Promise that resolves to the tsconfig objects
*/
export const getTsConfigs = (
  project: Project,
  packageConfig: PackageConfig,
  outputDirectory?: string
): TsConfigs => {
  return {
    defaults: {
      compilerOptions: getCompilerOptions(),
      include: getIncludePaths(userTsConfig),
    },
  }
}