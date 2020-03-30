export declare class IoHelper {
    readonly rootPath: string;
    constructor(rootPath: string);
    pathExists: (relativePath: string) => boolean;
    /**
     * Reads a file, relative to the root directory.
     */
    readFile: (relativePath: string) => Promise<string>;
    /**
     * Reads a file, relative to the root directory, and attempts to parse it as JSON.
     * Will reject the promise if the specified path is not a valid JSON file.
     */
    readJsonFile: (relativePath: string) => Promise<any>;
    /**
     * Writes a file, relative to the root directory.
     */
    writeFile: (relativePath: string, contents: string) => Promise<void>;
    /**
     * Writes a value as JSON into a file, relative to the root directory.
     */
    writeJsonFile: (relativePath: string, contents: any) => Promise<void>;
}
//# sourceMappingURL=io-helper.d.ts.map