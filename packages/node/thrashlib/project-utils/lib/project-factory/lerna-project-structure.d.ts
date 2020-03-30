import { Project } from '../model';
import { ProjectStructure } from '.';
/**
 * Project Structure representing a Lerna monorepo project. The `initialDirectory`
 * must be in the monorepo root, or one its sub-folders. The project root must contain
 * a valid 'lerna.json' file.
 */
export declare class LernaProjectStructure implements ProjectStructure {
    private readonly packageConfigFactory;
    constructor(packageConfigFactory?: import("./create-package-config").PackageConfigFactory);
    get name(): string;
    createProject: (initialDirectory: string) => Promise<Project | undefined>;
    private doCreateProject;
}
//# sourceMappingURL=lerna-project-structure.d.ts.map