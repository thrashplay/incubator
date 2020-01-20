# @thrashplay/project-utils

## Overview
Helpers for exploring packages in a standalone or monorepo project in an abstract way.
This package provides methods for discovering the project's structure, as well as metadata
for each package -- including the package name, directory path, and full `package.json`
contents.

Currently supported project structures include:
- standalone packages
- Lerna monorepos
- (*Coming Soon*) [Yarn workspaces](https://github.com/thrashplay/incubator-node/issues/1)

## Functions

### `getProject`
Creates a `Project` instance for the specified initial path, if the path is part
of a known project structure. Returns a promise that resolves to the new Project
instance, and rejects if the initial path is not part of a recognized project.

### `getPackages`
 Retrieves an array of `PackageConfig` instances for the specified initial path, 
 if the path is part of a known project structure. Returns a promise that resolves 
 to the result array, and rejects if the initial path is not part of a recognized 
 project.

### `getPackageDirectories`
Retrieves a Dictionary that maps package names to absolute directory paths containing
the packages for all packages that are part of a known project structure. Returns a 
promise that resolves to the result object, and rejects if the initial path is not part 
of a recognized project.

### `getPackageJsons`
Retrieves an array of `PackageJson` instances for the specified initial path, 
if the path is part of a known project structure. Returns a promise that resolves 
to the result array, and rejects if the initial path is not part of a recognized 
project.

## Model

### `Project`

Metadata for the project as a whole.

*Fields*:
- **isMonorepo**: Boolean indicating if the project is a monorepo or not
- **projectRootDir**: The root directory for the monorepo, or the single package directory if standalone
- **packages**: Array of `PackageConfig` objects, one for each package in the project

*Methods*:

Currently, `PackageConfig` instances provide the functionality from `IoHelper`: `pathExists`, `readFile`, `readJsonFile`,
`writeFile`, and `writeJsonFile`. All of these methods use paths relative to the package's directory. 
It is very likely that these APIs are going to change in the near future, to better separate concerns
in the code.

### `PackageConfig`

Metadata for a single package inside the project.

*Fields*:
- **name**: The name of the package
- **directory**: The directory containing the `package.json` file
- **packageJson**: `PackageJson` object containing the package configuration

*Methods*:
- **getPackageFromDir**: TBD
- **isProjectRoot**: TBD

Additionally, `Project` instances provide the functionality from `IoHelper`: `pathExists`, `readFile`, `readJsonFile`,
`writeFile`, and `writeJsonFile`. All of these methods use paths relative to the project's root directory. 
It is very likely that these APIs are going to change in the near future, to better separate concerns
in the code.

### `PackageJson`
Simple type declaration for the contents of a [`package.json`](https://docs.npmjs.com/files/package.json) file.