"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createPackageConfig = void 0;

var _model = require("../model");

var _createPackageJson = require("./create-package-json");

/**
 * Factory function for creating packages for a directory. The directory must contain
 * a `package.json` file.
 */
const createPackageConfig = directory => {
  return Promise.resolve((0, _createPackageJson.createPackageJson)(directory)).then(packageJson => new _model.PackageConfig(directory, packageJson));
};

exports.createPackageConfig = createPackageConfig;