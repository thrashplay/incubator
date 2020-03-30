"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Project = void 0;

var _lodash = require("lodash");

var _ioHelper = require("./io-helper");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Project {
  constructor(isMonorepo, directory, packages) {
    this.isMonorepo = isMonorepo;
    this.directory = directory;
    this.packages = packages;

    _defineProperty(this, "ioHelper", void 0);

    _defineProperty(this, "getPackage", name => (0, _lodash.find)(this.packages, {
      name
    }));

    _defineProperty(this, "getPackageFromDir", directory => {
      return (0, _lodash.find)(this.packages, {
        directory
      });
    });

    _defineProperty(this, "isProjectRoot", directory => (0, _lodash.isEqual)(this.directory, directory));

    _defineProperty(this, "pathExists", projectRelativePath => this.ioHelper.pathExists(projectRelativePath));

    _defineProperty(this, "readFile", projectRelativePath => this.ioHelper.readFile(projectRelativePath));

    _defineProperty(this, "readJsonFile", projectRelativePath => this.ioHelper.readJsonFile(projectRelativePath));

    _defineProperty(this, "writeFile", (projectRelativePath, contents) => {
      return this.ioHelper.writeFile(projectRelativePath, contents);
    });

    _defineProperty(this, "writeJsonFile", (projectRelativePath, contents) => {
      return this.ioHelper.writeJsonFile(projectRelativePath, contents);
    });

    if (!isMonorepo) {
      if (packages.length != 1) {
        throw new Error(`Standalone projects must have exactly one package. (Found: ${packages.length})`);
      }

      if (!(0, _lodash.isEqual)(directory, packages[0].directory)) {
        const pathInfo = `projectRoot="${directory}", packagePath="${packages[0].directory}"`;
        throw new Error(`Standalone package directories must match the project root. (${pathInfo})`);
      }
    }

    this.ioHelper = new _ioHelper.IoHelper(this.directory);
  }
  /**
   * Retrieves the package with the specified name from in this project. If the project does not
   * contain a package with the given name, `undefined` is returned.
   */


}

exports.Project = Project;