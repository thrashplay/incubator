import { promises as fs, Stats } from 'fs'

import { isNil } from 'lodash'

export * from './utils'

/**
 * Returns a Promise that resolves to `true` if the given path exists, or false otherwise.
 * If provided, the second argument is a function to check the `fs.Stats` object. If that
 * function is not specified or returns true for an existing path, this function will return 
 * true. If the function returns false, then this function will return false.
 * 
 * @param path the path to check
 */
export const pathExists = (path: string, predicate?: (stats: Stats) => boolean) => {
  return fs.stat(path)
    .then((stats) => isNil(predicate) || predicate(stats))
    .catch((error) => {
      // if stat called failed because file doesn't exist, just return false
      if (error.code === 'ENOENT') {
        return false
      }

      // otherwise we have some FS access problem, and rethrow
      throw error
    })
}

/**
 * Returns a Promise that resolves to `true` if the given path exists and is a regular file
 * or false otherwise.
 * @param path the path to check
 */
export const fileExists = (path: string) => pathExists(path, (stats) => stats.isFile())

/**
 * Returns a Promise that resolves to `true` if the given path exists and is a directory or
 * false otherwise.
 * @param path the path to check
 */
export const directoryExists = (path: string) => pathExists(path, (stats) => stats.isDirectory())