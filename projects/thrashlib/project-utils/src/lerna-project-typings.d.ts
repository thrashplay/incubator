/**
 * Minimal typings for Lerna's 'Project' class, to allow us to code against
 * it.
 */
declare module '@lerna/project' {
  export type FileMapper = <TResult>(paths: string[]) => TResult[]

  class Project {
    // this is wrong, but it's late and i'm tired
    fileFinder: <TResult>(fileName: string, fileMapper: FileMapper<TResult>) => Promise<TResult[]>
    rootPath: string
    
    constructor(cwd: string)
  }

  export = Project
}