#!/usr/bin/env node
"use strict";

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _jsYaml = _interopRequireDefault(require("js-yaml"));

var _yargs = _interopRequireDefault(require("yargs"));

var _fp = require("lodash/fp");

var _index = require("./index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const handleErrors = ({
  invalidConfigs
}) => {
  if (invalidConfigs.length == 1) {
    console.error('Failed to generate version for config entry:', invalidConfigs[0].id);
    throw invalidConfigs[0].error;
  } else if (invalidConfigs.length > 1) {
    console.error('Multiple errors generating config entries:');
    (0, _fp.forEach)(config => {
      console.error(`  ${config.id}: ${config.error.message}`);
    })(invalidConfigs);
    throw new Error('Config version calculation failed.');
  }
};

const getStackRelativePath = (stackPath, configPath) => _path.default.resolve(_path.default.resolve(stackPath, '..'), configPath);

const getEnvString = stackYamlPath => {
  const stackYaml = _fs.default.readFileSync(stackYamlPath, 'utf8');

  const stack = _jsYaml.default.safeLoad(stackYaml);

  const result = (0, _index.getConfigVersionVariables)(stack, {
    getConfigContent: ({
      path
    }) => _fs.default.readFileSync(getStackRelativePath(stackYamlPath, path), 'utf8')
  });
  handleErrors(result);
  return (0, _fp.flow)((0, _fp.map)(({
    name,
    version
  }) => `${name}=${version}`), (0, _fp.join)('\n'))(result.variables);
};

const main = ({
  stackYamlPath
}) => {
  const envString = getEnvString(stackYamlPath);

  _fs.default.writeFileSync(getStackRelativePath(stackYamlPath, 'config-versions.env'), envString);
};

_yargs.default.command('$0 <stack-yaml-path>', 'Generate versions file for a stack definition', yargs => {
  yargs.positional('stack-yaml-path', {
    normalize: true,
    coerce: _path.default.resolve
  });
}, main).argv;