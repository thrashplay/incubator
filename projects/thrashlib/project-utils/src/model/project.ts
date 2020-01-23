import { find, isEqual } from 'lodash'

import { PackageConfig } from './package-config'
import { IoHelper } from './io-helper'

export class Project {
  private readonly ioHelper: IoHelper

  constructor(
    /** true if the project is a monorepo */
    readonly isMonorepo: boolean,
    
    /** root directory of the project's monorepo, or the standalone direcotry */
    readonly directory: string,

    /** list of all packages in the project (will be single package if standalone) */
    readonly packages: PackageConfig[],
  ) { 
    if (!isMonorepo) {
      if (packages.length != 1) {
        throw new Error(`Standalone projects must have exactly one package. (Found: ${packages.length})`)
      }

      if (!isEqual(directory, packages[0].directory)) {
        const pathInfo = `projectRoot="${directory}", packagePath="${packages[0].directory}"`
        throw new Error(`Standalone package directories must match the project root. (${pathInfo})`)
      }
    }

    this.ioHelper = new IoHelper(this.directory)
  }

  getPackageFromDir = (directory: string) => {
    return find(this.packages, { directory })
  }

  isProjectRoot = (directory: string) => isEqual(this.directory, directory)

  /**
   * 
   */
  public pathExists = (projectRelativePath: string) => this.ioHelper.pathExists(projectRelativePath)

  /**
   * Reads a file, relative to the project's root directory.
   */
  public readFile = (projectRelativePath: string) => this.ioHelper.readFile(projectRelativePath)

  /**
   * Reads a file, relative to the project's root directory, and attempts to parse it as JSON.
   * Will reject the promise if the specified path is not a valid JSON file.
   */
  public readJsonFile = (projectRelativePath: string) => this.ioHelper.readJsonFile(projectRelativePath)

  /**
   * Writes a file, relative to the project's root directory. If the directory tree containing the file
   * does not exist, it will be created.
   */
  public writeFile = (projectRelativePath: string, contents: string) => {
    return this.ioHelper.writeFile(projectRelativePath, contents)
  }

  /**
   * Writes a value as JSON into a file, relative to the project's root directory. If the directory tree 
   * containing the file does not exist, it will be created.
   */
  public writeJsonFile = (projectRelativePath: string, contents: any) => {
    return this.ioHelper.writeJsonFile(projectRelativePath, contents)
  }
}

