import { Project } from '../model';
import { ProjectStructure } from './project-structure';
/**
 * Project Structure representing a standalone Node project. The `initialDirectory`
 * must be in the package root, and the package root must contain a valid `package.json` file.
 */
export declare class StandaloneProjectStructure implements ProjectStructure {
    private readonly packageConfigFactory;
    constructor(packageConfigFactory?: import("./create-package-config").PackageConfigFactory);
    get name(): string;
    createProject: (initialDirectory: string) => Promise<Project | undefined>;
    private doCreateProject;
}
//# sourceMappingURL=standalone-project-structure.d.ts.map