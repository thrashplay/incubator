/// <reference types="lodash" />
export * from './model';
export * from './project-factory';
/**
 * Creates a `Project` instance for the specified initial path, if the path is part
 * of a known project structure. Returns a promise that resolves to the new Project
 * instance, and rejects if the initial path is not part of a recognized project.
 *
 * Currently known project structures include:
 *   - standalone packages
 *   - Lerna monorepos
 */
export declare const getProject: (initialPath: string) => Promise<import("./model").Project>;
/**
 * Retrieves an array of `PackageConfig` instances for the specified initial path,
 * if the path is part of a known project structure. Returns a promise that resolves
 * to the result array, and rejects if the initial path is not part of a recognized
 * project.
 *
 * Currently known project structures include:
 *   - standalone packages
 *   - Lerna monorepos
 */
export declare const getPackages: (initialPath: string) => Promise<import("./model").PackageConfig[]>;
/**
 * Retrieves a Dictionary that maps package names to absolute directory paths containing
 * the packages for all packages that are part of a known project structure. Returns a
 * promise that resolves to the result object, and rejects if the initial path is not part
 * of a recognized project.
 *
 * Currently known project structures include:
 *   - standalone packages
 *   - Lerna monorepos
 */
export declare const getPackageDirectories: (initialPath: string) => Promise<import("lodash").Dictionary<string>>;
/**
 * Retrieves an array of `PackageJson` instances for the specified initial path,
 * if the path is part of a known project structure. Returns a promise that resolves
 * to the result array, and rejects if the initial path is not part of a recognized
 * project.
 *
 * Currently known project structures include:
 *   - standalone packages
 *   - Lerna monorepos
 */
export declare const getPackageJsons: (initialPath: string) => Promise<import("./model").PackageJson[]>;
//# sourceMappingURL=index.d.ts.map