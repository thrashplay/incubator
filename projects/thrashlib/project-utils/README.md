# @thrashplay/project-utils

Currently known project structures include:
- standalone packages
- Lerna monorepos

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