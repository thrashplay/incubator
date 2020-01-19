import {  map, zipObject } from 'lodash'

import {
  ProjectFactory,
  LernaProjectStructure,
  createPackageConfig,
  StandaloneProjectStructure,
} from './project-factory'

export * from './model'
export * from './project-factory'

/**
 * Creates a `Project` instance for the specified initial path, if the path is part
 * of a known project structure. Returns a promise that resolves to the new Project
 * instance, and rejects if the initial path is not part of a recognized project.
 * 
 * Currently known project structures include:
 *   - standalone packages
 *   - Lerna monorepos
 */
export const getProject = (initialPath: string) => {
  const factory = new ProjectFactory([
    new LernaProjectStructure(createPackageConfig),
    new StandaloneProjectStructure(createPackageConfig),
  ])
  return factory.createProject(initialPath)
}

/**
 * Retrieves an array of `PackageConfig` instances for the specified initial path, 
 * if the path is part of a known project structure. Returns a promise that resolves 
 * to the result array, and rejects if the initial path is not part of a recognized 
 * project.
 * 
 * Currently known project structures include:
 *   - standalone packages
 *   - Lerna monorepos
 */
export const getPackages = (initialPath: string) => {
  return getProject(initialPath)
    .then((project) => project.packages)
}

/**
 * Retrieves a Dictionary that maps package names to absolute directory paths containing
 * the packages for all packages that are part of a known project structure. Returns a 
 * promise that resolves to the result object, and rejects if the initial path is not part 
 * of a recognized project.
 * 
 * Currently known project structures include:
 *   - standalone packages
 *   - Lerna monorepos
 */
export const getPackageDirectories = (initialPath: string) => {
  return getProject(initialPath)
    .then((project) => {
      const packages = project.packages
      return zipObject(
        map(packages, (pkg) => pkg.name),
        map(packages, (pkg) => pkg.directory))
    })
}

/**
 * Retrieves an array of `PackageJson` instances for the specified initial path, 
 * if the path is part of a known project structure. Returns a promise that resolves 
 * to the result array, and rejects if the initial path is not part of a recognized 
 * project.
 * 
 * Currently known project structures include:
 *   - standalone packages
 *   - Lerna monorepos
 */
export const getPackageJsons = (initialPath: string) => {
  return getProject(initialPath)
    .then((project) => map(project.packages, (pkg) => pkg.packageJson))
}