import Project from '@lerna/project'
import { isNil, defaultTo, map } from 'lodash'

import { PackageConfigFactory, createPackageConfigFactory } from '..'

export interface ProjectFactoryOptions {
  packageConfigFactory?: PackageConfigFactory,
}

export interface ProjectFactory {
  createProject: (fromDir: string) => Promise<Project>
}

const getProjectStructure = async (fromDirectory = process.cwd()) => {
  const strategies = [lerna, standalone]

  for (let strategy of strategies) {
    const structure = await strategy(fromDirectory)
    if (!isNil(structure)) {
      return structure
    }
  }

  return undefined
}

export const createProjectFactory = ({
  packageConfigFactory = createPackageConfigFactory(),
}: ProjectFactoryOptions = {}): ProjectFactory => ({
  createProject: (initialDir: string) => {
    return getProjectStructure(initialDir)
      .then((projectStructure) => {
        if (isNil(projectStructure)) {
          return Promise.reject('Unable to recognize project structure.')
        } else {
          const packageDirs = defaultTo(projectStructure.packageDirectories, [])
          const packagePromises = map(packageDirs, (packageDir) => {
            console.log('creating package config:', packageDir)
            return packageConfigFactory.createPackageConfig(packageDir)
          })
          return Promise.all(packagePromises)
            .then((packages) => new Project(projectStructure.isMonorepo, projectStructure.rootDirectory, packages))
        }
      })
  },
})