import { ProjectStructure } from './project-structure';
export declare class ProjectFactory {
    private readonly suppportedProjectStructures;
    constructor(suppportedProjectStructures: ProjectStructure[]);
    readonly createProject: (initialDirectory: string) => Promise<import("..").Project>;
}
//# sourceMappingURL=project-factory.d.ts.map