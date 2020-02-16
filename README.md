<p align="center">
  <img alt="Gear Icon" src="./docs/assets/images/gear.svg">
</p>

<h1 align="center">
  Thrashplay Incubator: Node
</h1>

<p align="center">
  Prototypes, experiments, and early release of Thrashplay Node projects.
</p>

<p align="center">
  <a href="https://drone.thrashplay.com/thrashplay/incubator-node"><img src="https://drone.thrashplay.com/api/badges/thrashplay/incubator-node/status.svg" /></a>
</p>

## Projects
- [Thrashlib](#thrashlib)
  - [fs-utils](./projects/thrashlib/fs-utils#readme)
  - [logging](./projects/thrashlib/logging#readme)
  - [mock-fs](./projects/thrashlib/mock-fs#readme)
  - [project-utils](./projects/thrashlib/project-utils#readme)
  - [tsconfig-utils](./projects/thrashlib/tsconfig-utils#readme)
- [Ringlet](#ringlet)

## Thrashlib
Library of utilities developed by Thrashplay, mostly for internal use on other projects. The packages here are meant to be small, and focused on single tasks. 

### Packages

- [**fs-utils**](./projects/thrashlib/fs-utils#readme): Helper functions for working with files and paths.
- [**logging**](./projects/thrashlib/logging#readme): Basic logging API, intended as a placeholder interface until more robust logging is implemented.
- [**mock-fs**](./projects/thrashlib/mock-fs#readme): Mock `fs` implementation that is basically a Typescript adaptation of [metro-memory-fs](https://github.com/facebook/metro/tree/master/packages/metro-memory-fs)
- [**project-utils**](./projects/thrashlib/project-utils#readme): Helpers for exploring packages in a standalone or monorepo project in an abstract way.
- [**tsconfig-utils**](./projects/thrashlib/project-utils#readme): Utilities for working with tsconfig files in a project.

## Ringlet
One build system to rule them all. `Ringlet` aims to ease much of the burden of setting up a new Typescript project by 
providing a very opinionated, convention-based toolkit for eliminating or generating he configuration required for common
tools such as `tsc`, `Babel`, and `webpack`. Unlike similar efforts, such as [create-react-app](https://github.com/facebook/create-react-app), `Ringlet`'s goal is to allow users much flexibility without the jarring experience of having to *eject* their
application.