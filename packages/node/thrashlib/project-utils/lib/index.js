"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  getProject: true,
  getPackages: true,
  getPackageDirectories: true,
  getPackageJsons: true
};
exports.getPackageJsons = exports.getPackageDirectories = exports.getPackages = exports.getProject = void 0;

var _lodash = require("lodash");

var _projectFactory = require("./project-factory");

Object.keys(_projectFactory).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _projectFactory[key];
    }
  });
});

var _model = require("./model");

Object.keys(_model).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _model[key];
    }
  });
});

/**
 * Creates a `Project` instance for the specified initial path, if the path is part
 * of a known project structure. Returns a promise that resolves to the new Project
 * instance, and rejects if the initial path is not part of a recognized project.
 * 
 * Currently known project structures include:
 *   - standalone packages
 *   - Lerna monorepos
 */
const getProject = initialPath => {
  const factory = new _projectFactory.ProjectFactory([new _projectFactory.LernaProjectStructure(_projectFactory.createPackageConfig), new _projectFactory.StandaloneProjectStructure(_projectFactory.createPackageConfig)]);
  return factory.createProject(initialPath);
};
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


exports.getProject = getProject;

const getPackages = initialPath => {
  return getProject(initialPath).then(project => project.packages);
};
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


exports.getPackages = getPackages;

const getPackageDirectories = initialPath => {
  return getProject(initialPath).then(project => {
    const packages = project.packages;
    return (0, _lodash.zipObject)((0, _lodash.map)(packages, pkg => pkg.name), (0, _lodash.map)(packages, pkg => pkg.directory));
  });
};
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


exports.getPackageDirectories = getPackageDirectories;

const getPackageJsons = initialPath => {
  return getProject(initialPath).then(project => (0, _lodash.map)(project.packages, pkg => pkg.packageJson));
};

exports.getPackageJsons = getPackageJsons;