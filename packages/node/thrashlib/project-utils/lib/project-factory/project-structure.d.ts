import { Project } from '../model';
/**
 * Interface for objects that are able to create a `Project` instance from a given directory.
 */
export interface ProjectStructure {
    name: string;
    createProject: (initialDirectory: string) => Promise<Project | undefined>;
}
//# sourceMappingURL=project-structure.d.ts.map