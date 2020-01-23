import { PackageConfig } from '../model'

import { createPackageJson } from './create-package-json'

export type PackageConfigFactory = (packageDirectory: string) => Promise<PackageConfig>

/**
 * Factory function for creating packages for a directory. The directory must contain
 * a `package.json` file.
 */
export const createPackageConfig: PackageConfigFactory = (directory: string): Promise<PackageConfig> => {
  return Promise.resolve(createPackageJson(directory))
    .then((packageJson) => new PackageConfig(directory, packageJson))
}