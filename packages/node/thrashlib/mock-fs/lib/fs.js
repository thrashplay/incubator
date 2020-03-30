"use strict";

var _path = _interopRequireDefault(require("path"));

var _lodash = require("lodash");

var _metroMemoryFs = _interopRequireDefault(require("metro-memory-fs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let fs; // function setMockFilesystem(object, platform) {
//   reset(platform);
//   const root = platform === 'win32' ? 'c:\\' : '/';
//   mockDir(root, {...object});
//   return root;
// }
// function mockDir(dirPath, desc) {
//   for (const entName in desc) {
//     const ent = desc[entName];
//     const entPath = path.join(dirPath, entName);
//     if (typeof ent === 'string' || ent instanceof Buffer) {
//       fs.writeFileSync(entPath, ent);
//       continue;
//     }
//     if (typeof ent !== 'object') {
//       throw new Error(require('util').format('invalid entity:', ent));
//     }
//     if (ent.SYMLINK != null) {
//       fs.symlinkSync(ent.SYMLINK, entPath);
//       continue;
//     }
//     fs.mkdirSync(entPath);
//     mockDir(entPath, ent);
//   }
// }

function reset(platform = 'posix', cwdOverride) {
  const resetPath = (0, _lodash.get)(_path.default, ['mock', 'reset']);

  if (!(0, _lodash.isFunction)(resetPath)) {
    throw new Error('to use this "fs" module mock, you must also mock the "path" module');
  }

  resetPath(platform);
  const cwd = !(0, _lodash.isNil)(cwdOverride) ? cwdOverride : platform === 'win32' ? 'c:\\' : '/';
  fs = new _metroMemoryFs.default({
    platform,
    cwd: () => cwd
  });
  (0, _lodash.merge)(mockFs, fs);
}

const mockHelpers = {
  __reset: reset
};
const mockFs = {};
(0, _lodash.merge)(mockFs, mockHelpers);
reset();
module.exports = mockFs;