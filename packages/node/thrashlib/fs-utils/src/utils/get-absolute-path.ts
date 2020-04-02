import fs from 'fs'
import path from 'path'

/**
 * Calculates the absolute path from a relative path, using the specified `baseFile` as a base.
 * If `baseFile` is a directory, it will be used as the base for calculating the new path. If
 * `baseFile` is a file, then its parent directory will be used.
 */
export const getAbsolutePath = (baseFile: string, relativePath: string) =>
  (baseFile.length === 0) || fs.statSync(baseFile).isDirectory()
    ? path.resolve(baseFile, relativePath)
    : path.resolve(path.dirname(baseFile), relativePath)