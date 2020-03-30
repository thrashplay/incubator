"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _loadTsConfig = require("./load-ts-config");

Object.keys(_loadTsConfig).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _loadTsConfig[key];
    }
  });
});

var _tsConfig = require("./ts-config");

Object.keys(_tsConfig).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _tsConfig[key];
    }
  });
});