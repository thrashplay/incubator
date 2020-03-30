"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadTsConfig = void 0;

var _fs = require("fs");

var _path = _interopRequireDefault(require("path"));

var _os = _interopRequireDefault(require("os"));

var _ajv = _interopRequireDefault(require("ajv"));

var _lodash = require("lodash");

var _tsconfigSchema = _interopRequireDefault(require("./schemas/tsconfig.schema.json"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ajv = new _ajv.default({
  allErrors: true,
  meta: false,
  schemaId: 'id'
});
ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-04.json'));
const validateTsconfig = ajv.compile(_tsconfigSchema.default);

const getErrorMessage = error => {
  switch (error.keyword) {
    case 'additionalProperties':
      return `has unrecognized property: "${error.dataPath}.${(0, _lodash.get)(error, 'params.additionalProperty')}"`;

    case 'enum':
      return `${error.dataPath} must equal one of: ${(0, _lodash.get)(error, 'params.allowedValues')}`;

    case 'type':
      return `${error.dataPath} ${error.message}`;

    default:
      return error.message;
  }
};
/**
 * Loads a `TypescriptConfiguration` from a specified path.
 * 
 * If the path is a directory, then a file named `tsconfig.json` will be used to load the configuration.
 * Otherwise, the path is assumed to be the name of a file to load.
 * 
 * If `flatten` is true, then all parent tsconfig files specified via `extends` will be loaded, and the 
 * settings will be merged into the result. In this case, the `extends` property will be undefined 
 * on the returned option. If `flatten` is false, then only the settings directly specified at the given 
 * path will be loaded.
 * 
 * This method returns a Promise that resolves to the requested `TypescriptConfiguration`, and rejects
 * if the `path` is invalid or another error occurs.
 */


const loadTsConfig = (tsconfigPath, _flatten = false) => {
  return _fs.promises.stat(tsconfigPath).catch(() => {
    throw (0, _lodash.assign)(new Error(`tsconfig path does not exist: ${tsconfigPath}`), {
      code: 'ENOENT'
    });
  }).then(stats => {
    return stats.isDirectory() ? loadTsconfigFromDirectory(tsconfigPath) : loadTsconfigFromFile(tsconfigPath);
  });
};
/**
 * Helper function that loads a `tsconfig.json` from the specified directory, if it exists and is a regular file. If the
 * file does not exist, or refers to a directory, then the result is a rejected promise. Otherwise, the result will resolve
 * to the contents of that file, parsed as a `TsConfig` instance.
 */


exports.loadTsConfig = loadTsConfig;

const loadTsconfigFromDirectory = directory => {
  const tsconfigPath = _path.default.join(directory, 'tsconfig.json');

  return _fs.promises.stat(tsconfigPath).catch(() => {
    throw (0, _lodash.assign)(new Error(`tsconfig path does not exist: ${tsconfigPath}`), {
      code: 'ENOENT'
    });
  }).then(stats => {
    return stats.isDirectory() ? Promise.reject((0, _lodash.assign)(new Error(`Found directory named 'tsconfig.json' instead of JSON file: ${tsconfigPath}`), {
      code: 'EISDIR'
    })) : loadTsconfigFromFile(tsconfigPath);
  });
};
/**
 * Helper function that loads a `tsconfig.json` from the specified file. This function does not check that the file exists, and
 * simply attempts to read it. If the file does not exist, then the result is a rejected promise. Otherwise, the result will resolve
 * to the contents of that file, parsed as a `TsConfig` instance.
 */


const loadTsconfigFromFile = file => {
  return _fs.promises.readFile(file, 'utf8').then(data => JSON.parse(data)).catch(err => {
    throw new Error(`'${file}' was not valid JSON: ${err.message}`);
  }).then(parsedJson => {
    const valid = validateTsconfig(parsedJson);

    if (!valid) {
      const separator = (0, _lodash.size)(validateTsconfig.errors) > 1 ? ` ${_os.default.EOL}` : ' ';
      throw new Error(`'${file}' is not a valid tsconfig.json file:${separator}${(0, _lodash.join)((0, _lodash.map)(validateTsconfig.errors, getErrorMessage), _os.default.EOL)}`);
    }

    return parsedJson;
  });
};