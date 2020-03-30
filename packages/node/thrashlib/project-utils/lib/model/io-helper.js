"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IoHelper = void 0;

var _path = _interopRequireDefault(require("path"));

var _fs = _interopRequireWildcard(require("fs"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class IoHelper {
  constructor(rootPath) {
    this.rootPath = rootPath;

    _defineProperty(this, "pathExists", relativePath => {
      const filePath = _path.default.resolve(this.rootPath, relativePath);

      try {
        _fs.default.statSync(filePath);

        return true;
      } catch (err) {
        // assume path doesn't exist
        return false;
      }
    });

    _defineProperty(this, "readFile", relativePath => {
      return _fs.promises.readFile(_path.default.resolve(this.rootPath, relativePath), 'utf8');
    });

    _defineProperty(this, "readJsonFile", relativePath => {
      return this.readFile(relativePath).then(fileContents => JSON.parse(fileContents)).catch(err => {
        if (err instanceof SyntaxError) {
          err.message = `File '${relativePath}' does not contain valid JSON: ${err.message}`;
        }

        throw err;
      });
    });

    _defineProperty(this, "writeFile", (relativePath, contents) => {
      const filePath = _path.default.resolve(this.rootPath, relativePath);

      return _fs.promises.mkdir(_path.default.dirname(filePath), {
        recursive: true
      }).then(() => _fs.promises.writeFile(filePath, contents));
    });

    _defineProperty(this, "writeJsonFile", (relativePath, contents) => {
      return this.writeFile(relativePath, JSON.stringify(contents, null, 2));
    });
  }

}

exports.IoHelper = IoHelper;