"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createPackageJson = void 0;

var _fs = require("fs");

var _path = _interopRequireDefault(require("path"));

var _packageJson = require("../model/package-json");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Factory function for creating the package JSON object for a directory. The directory must contain
 * a `package.json` file.
 */
const createPackageJson = directory => {
  return Promise.resolve(directory).then(loadPackageConfig).then(validatePackageConfig);
};

exports.createPackageJson = createPackageJson;

const loadJson = filePath => {
  return _fs.promises.readFile(filePath, 'utf8').then(contents => JSON.parse(contents));
};

const loadPackageConfig = directory => {
  const packageJsonPath = _path.default.resolve(directory, 'package.json');

  return Promise.all([directory, loadJson(packageJsonPath)]).catch(err => {
    if (err instanceof SyntaxError) {
      throw new Error(`Invalid package.json format: ${packageJsonPath}`);
    }

    throw err;
  });
};

const validatePackageConfig = ([directory, unvalidatedPackageJson]) => {
  const packageJsonPath = _path.default.resolve(directory, 'package.json');

  return Promise.resolve().then(() => (0, _packageJson.validatePackageJson)(unvalidatedPackageJson)).catch(() => Promise.reject(new Error(`Invalid package.json JSON structure: ${packageJsonPath}`)));
};