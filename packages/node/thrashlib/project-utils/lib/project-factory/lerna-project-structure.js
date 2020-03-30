"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LernaProjectStructure = void 0;

var _path = _interopRequireDefault(require("path"));

var _lodash = require("lodash");

var _project = _interopRequireDefault(require("@lerna/project"));

var _fsUtils = require("@thrashplay/fs-utils");

var _model = require("../model");

var _ = require(".");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const isLernaProjectValid = project => {
  return (0, _fsUtils.fileExists)(_path.default.resolve(project.rootPath, 'lerna.json'));
};

const mapAllUsing = mapper => {
  return paths => (0, _lodash.map)(paths, mapper);
};

const mapPackageJsonToDirectory = packageJsonPath => _path.default.dirname(packageJsonPath);
/**
 * Project Structure representing a Lerna monorepo project. The `initialDirectory` 
 * must be in the monorepo root, or one its sub-folders. The project root must contain
 * a valid 'lerna.json' file.
 */


class LernaProjectStructure {
  constructor(packageConfigFactory = _.createPackageConfig) {
    this.packageConfigFactory = packageConfigFactory;

    _defineProperty(this, "createProject", initialDirectory => {
      return Promise.resolve(new _project.default(initialDirectory)).then(async lernaProject => (await isLernaProjectValid(lernaProject)) ? lernaProject : undefined).then(lernaProject => {
        return lernaProject ? this.doCreateProject(lernaProject) : undefined;
      });
    });

    _defineProperty(this, "doCreateProject", lernaProject => {
      return lernaProject.fileFinder('package.json', mapAllUsing(mapPackageJsonToDirectory)).then(packageDirectories => Promise.all((0, _lodash.map)(packageDirectories, directory => this.packageConfigFactory(directory)))).then(packageConfigs => new _model.Project(true, lernaProject.rootPath, packageConfigs));
    });
  }

  get name() {
    return 'Lerna';
  }

}

exports.LernaProjectStructure = LernaProjectStructure;