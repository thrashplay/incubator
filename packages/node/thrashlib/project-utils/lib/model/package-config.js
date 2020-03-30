"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PackageConfig = void 0;

var _ioHelper = require("./io-helper");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Encapsulates configuration and metadata for a single package in a project, and also provides
 * read/write access to the files in that package.
 */
class PackageConfig {
  constructor(directory, packageJson) {
    this.directory = directory;
    this.packageJson = packageJson;

    _defineProperty(this, "ioHelper", void 0);

    _defineProperty(this, "name", void 0);

    _defineProperty(this, "pathExists", packageRelativePath => this.ioHelper.pathExists(packageRelativePath));

    _defineProperty(this, "readFile", packageRelativePath => this.ioHelper.readFile(packageRelativePath));

    _defineProperty(this, "readJsonFile", packageRelativePath => this.ioHelper.readJsonFile(packageRelativePath));

    _defineProperty(this, "writeFile", (packageRelativePath, contents) => {
      return this.ioHelper.writeFile(packageRelativePath, contents);
    });

    _defineProperty(this, "writeJsonFile", (packageRelativePath, contents) => {
      return this.ioHelper.writeJsonFile(packageRelativePath, contents);
    });

    this.name = this.packageJson.name;
    this.ioHelper = new _ioHelper.IoHelper(this.directory);
  }
  /**
   * 
   */


}

exports.PackageConfig = PackageConfig;