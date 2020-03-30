"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StandaloneProjectStructure = void 0;

var _path = _interopRequireDefault(require("path"));

var _fsUtils = require("@thrashplay/fs-utils");

var _model = require("../model");

var _createPackageConfig = require("./create-package-config");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Project Structure representing a standalone Node project. The `initialDirectory` 
 * must be in the package root, and the package root must contain a valid `package.json` file.
 */
class StandaloneProjectStructure {
  constructor(packageConfigFactory = _createPackageConfig.createPackageConfig) {
    this.packageConfigFactory = packageConfigFactory;

    _defineProperty(this, "createProject", initialDirectory => {
      return (0, _fsUtils.fileExists)(_path.default.resolve(initialDirectory, 'package.json')).then(exists => exists ? this.doCreateProject(initialDirectory) : undefined);
    });

    _defineProperty(this, "doCreateProject", initialDirectory => {
      return this.packageConfigFactory(initialDirectory).then(packageConfig => new _model.Project(false, initialDirectory, [packageConfig]));
    });
  }

  get name() {
    return 'Standalone';
  }

}

exports.StandaloneProjectStructure = StandaloneProjectStructure;