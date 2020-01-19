import path from 'path'

import { map } from 'lodash'
import LernaProject from '@lerna/project'
import { fileExists } from '@thrashplay/fs-utils'

import { Project, PackageConfig } from '../model'

import { ProjectStructure } from './types'

const isLernaProjectValid = (project: LernaProject) => {
  return fileExists(path.resolve(project.rootPath, 'lerna.json'))
}

const mapAllUsing = <TResult>(mapper: (pathString: string) => TResult) => {
  return (paths: string[]) => map(paths, mapper)
}
const mapPackageJsonToDirectory = (packageJsonPath: string) => path.dirname(packageJsonPath)

/**
 * Project Structure representing a Lerna monorepo project. The `initialDirectory` 
 * must be in the monorepo root, or one its sub-folders. The project root must contain
 * a valid 'lerna.json' file.
 */
export class LernaProjectStructure implements ProjectStructure {
  public constructor(
    private readonly packageConfigFactory = PackageConfig.create
  ) { }

  get name() {
    return 'Lerna'
  }

  public createProject = (initialDirectory: string) => {
    return Promise.resolve(new LernaProject(initialDirectory))
      .then(async (lernaProject) => await isLernaProjectValid(lernaProject) ? lernaProject : undefined)
      .then((lernaProject) => {
        return lernaProject ? this.doCreateProject(lernaProject) : undefined
      })
  }

  private doCreateProject = (lernaProject: LernaProject) => {
    return lernaProject.fileFinder<string>('package.json', mapAllUsing(mapPackageJsonToDirectory))
      .then((packageDirectories) => Promise.all(map(packageDirectories, (directory) => this.packageConfigFactory(directory))))
      .then((packageConfigs) => new Project(true, lernaProject.rootPath, packageConfigs))
  }
}