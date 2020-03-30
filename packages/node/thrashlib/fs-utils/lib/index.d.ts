/// <reference types="node" />
import { Stats } from 'fs';
/**
 * Returns a Promise that resolves to `true` if the given path exists, or false otherwise.
 * If provided, the second argument is a function to check the `fs.Stats` object. If that
 * function is not specified or returns true for an existing path, this function will return
 * true. If the function returns false, then this function will return false.
 *
 * @param path the path to check
 */
export declare const pathExists: (path: string, predicate?: ((stats: Stats) => boolean) | undefined) => Promise<boolean>;
/**
 * Returns a Promise that resolves to `true` if the given path exists and is a regular file
 * or false otherwise.
 * @param path the path to check
 */
export declare const fileExists: (path: string) => Promise<boolean>;
/**
 * Returns a Promise that resolves to `true` if the given path exists and is a directory or
 * false otherwise.
 * @param path the path to check
 */
export declare const directoryExists: (path: string) => Promise<boolean>;
//# sourceMappingURL=index.d.ts.map