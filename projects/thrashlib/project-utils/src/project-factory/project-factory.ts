import { isEmpty, isNil, join, map } from 'lodash'

import { ProjectStructure } from './project-structure'

export class ProjectFactory {
  public constructor(
    private readonly suppportedProjectStructures: ProjectStructure[],
  ) { 
    if (isEmpty(this.suppportedProjectStructures)) {
      throw new Error('Cannot create ProjectFactory without any project structures.')
    }
  }

  public readonly createProject = async (initialDirectory: string) => {
    for (let structure of this.suppportedProjectStructures) {
      const project = await structure.createProject(initialDirectory)
      if (!isNil(project)) {
        return project
      }
    }

    const knownStructures = join(map(this.suppportedProjectStructures, (structure) => structure.name), ', ')
    throw new Error(`Unable to determine project structure from among known types: [${knownStructures}]`)
  }
}
