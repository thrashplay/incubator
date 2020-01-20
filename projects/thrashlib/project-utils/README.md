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

### `PackageConfig`

*Fields*:
- **name**: The name of the package
- **directory**: The directory containing the `package.json` file
- **packageJson**: `PackageJson` object containing the package configuration

### `PackageJson`
Simple type declaration for the contents of a `package.json` file.