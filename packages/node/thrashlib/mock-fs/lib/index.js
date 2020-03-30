"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  path: true,
  fs: true
};
exports.fs = exports.path = void 0;

var _types = require("./types");

Object.keys(_types).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _types[key];
    }
  });
});

const path = require('./path');

exports.path = path;

const fs = require('./fs');

exports.fs = fs;