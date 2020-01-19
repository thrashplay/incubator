import path from 'path'

import { fileExists } from '@thrashplay/fs-utils'

import { Project, PackageConfig } from '../model'

import { ProjectStructure } from './types'

/**
 * Project Structure representing a standalone Node project. The `initialDirectory` 
 * must be in the package root, and the package root must contain a valid `package.json` file.
 */
export class StandaloneProjectStructure implements ProjectStructure {
  public constructor(
    private readonly packageConfigFactory = PackageConfig.create
  ) { }

  get name() {
    return 'Standalone'
  }

  public createProject = (initialDirectory: string) => {
    return fileExists(path.resolve(initialDirectory, 'package.json'))
      .then((exists) => exists ? this.doCreateProject(initialDirectory) : undefined)
  }

  private doCreateProject = (initialDirectory: string) => {
    return this.packageConfigFactory(initialDirectory)
      .then((packageConfig) => new Project(
        false,
        initialDirectory,
        [packageConfig],
      ))
  }
}