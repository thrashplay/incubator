import { promises as fsp } from 'fs'
import path from 'path'

import { PackageConfig } from '../model'
import { validatePackageJson } from '../model/package-json'

export type PackageConfigFactory = (packageDirectory: string) => Promise<PackageConfig>

const loadJson = (filePath: string) => {
  return fsp.readFile(filePath, 'utf8')
    .then((contents) => JSON.parse(contents))
}

const loadPackageConfig = (directory: string) => {
  const packageJsonPath = path.resolve(directory, 'package.json')
  return Promise.all([directory, loadJson(packageJsonPath)])
    .catch((err) => {
      if (err instanceof SyntaxError) {
        throw new Error(`Invalid package.json format: ${packageJsonPath}`)
      }
      throw err
    })
}

const validatePackageConfig = ([directory, unvalidatedPackageJson]: [string, any]) => {
  const packageJsonPath = path.resolve(directory, 'package.json')
  return Promise.resolve()
    .then(() => validatePackageJson(unvalidatedPackageJson))
    .catch(() => Promise.reject(new Error(`Invalid package.json JSON structure: ${packageJsonPath}`)))
}

/**
 * Factory function for creating packages for a directory. The directory must contain
 * a `package.json` file.
 */
export const createPackageConfig: PackageConfigFactory = (directory: string): Promise<PackageConfig> => {
  return Promise.resolve(directory)
    .then(loadPackageConfig)
    .then(validatePackageConfig)
    .then((validatedPackageJson) => new PackageConfig(directory, validatedPackageJson))
}