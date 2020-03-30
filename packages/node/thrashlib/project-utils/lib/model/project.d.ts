import { PackageConfig } from './package-config';
export declare class Project {
    /** true if the project is a monorepo */
    readonly isMonorepo: boolean;
    /** root directory of the project's monorepo, or the standalone direcotry */
    readonly directory: string;
    /** list of all packages in the project (will be single package if standalone) */
    readonly packages: PackageConfig[];
    private readonly ioHelper;
    constructor(
    /** true if the project is a monorepo */
    isMonorepo: boolean, 
    /** root directory of the project's monorepo, or the standalone direcotry */
    directory: string, 
    /** list of all packages in the project (will be single package if standalone) */
    packages: PackageConfig[]);
    /**
     * Retrieves the package with the specified name from in this project. If the project does not
     * contain a package with the given name, `undefined` is returned.
     */
    getPackage: (name: string) => PackageConfig | undefined;
    getPackageFromDir: (directory: string) => PackageConfig | undefined;
    isProjectRoot: (directory: string) => boolean;
    /**
     *
     */
    pathExists: (projectRelativePath: string) => boolean;
    /**
     * Reads a file, relative to the project's root directory.
     */
    readFile: (projectRelativePath: string) => Promise<string>;
    /**
     * Reads a file, relative to the project's root directory, and attempts to parse it as JSON.
     * Will reject the promise if the specified path is not a valid JSON file.
     */
    readJsonFile: (projectRelativePath: string) => Promise<any>;
    /**
     * Writes a file, relative to the project's root directory. If the directory tree containing the file
     * does not exist, it will be created.
     */
    writeFile: (projectRelativePath: string, contents: string) => Promise<void>;
    /**
     * Writes a value as JSON into a file, relative to the project's root directory. If the directory tree
     * containing the file does not exist, it will be created.
     */
    writeJsonFile: (projectRelativePath: string, contents: any) => Promise<void>;
}
//# sourceMappingURL=project.d.ts.map