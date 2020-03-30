const path = require('path')
const fs = require('fs')

const glob = require('glob')
const { pathsToModuleNameMapper } = require('ts-jest/utils')
const { defaults: tsjPreset } = require('ts-jest/presets')
const { concat, map, reduce } = require('lodash')

const { compilerOptions } = require('./tsconfig')

const readJsonFile = (file) => {
  return JSON.parse(fs.readFileSync(file))
}

const createPackageFromDir = (dir) => {
  const packageJson = require(path.resolve(dir, 'package.json'))

  return {
    displayName: packageJson.name,
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/packages/node/' }),
    roots: [
      path.resolve(dir, 'src'),
    ],
    testPathIgnorePatterns: [
      'dist',
      'node_modules',
    ],
  }
}

const lernaConfig = readJsonFile('lerna.json')
const packageDirs = reduce(lernaConfig.packages, (directoryList, globPattern) => {
  return concat(directoryList, glob.sync(globPattern))
}, [])


module.exports = {
  ...tsjPreset,
  automock: false,
  bail: false,
  collectCoverageFrom: [
    '**/*.{ts,tsx,js,jsx}',
    '!**/node_modules/**',
    '!**/dist/**',
  ],
  // coverage?
  projects: map(packageDirs, createPackageFromDir),
  rootDir: __dirname,
  testEnvironment: 'node',
  testPathIgnorePatterns: [
    'dist',
    'node_modules',
  ],
}