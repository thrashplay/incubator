import { PackageJson } from '@thrashplay/project-utils';
/**
 * Encapsulates configuration and metadata for a single package in a project, and also provides
 * read/write access to the files in that package.
 */
export declare class PackageConfig {
    readonly directory: string;
    readonly packageJson: PackageJson;
    private readonly ioHelper;
    readonly name: string;
    constructor(directory: string, packageJson: PackageJson);
    /**
     *
     */
    pathExists: (packageRelativePath: string) => boolean;
    /**
     * Reads a file, relative to the package's root directory.
     */
    readFile: (packageRelativePath: string) => Promise<string>;
    /**
     * Reads a file, relative to the package's root directory, and attempts to parse it as JSON.
     * Will reject the promise if the specified path is not a valid JSON file.
     */
    readJsonFile: (packageRelativePath: string) => Promise<any>;
    /**
     * Writes a file, relative to the package's root directory. If the directory tree containing the file
     * does not exist, it will be created.
     */
    writeFile: (packageRelativePath: string, contents: string) => Promise<void>;
    /**
     * Writes a value as JSON into a file, relative to the package's root directory. If the directory
     * tree containing the file  does not exist, it will be created.
     */
    writeJsonFile: (packageRelativePath: string, contents: any) => Promise<void>;
}
//# sourceMappingURL=package-config.d.ts.map