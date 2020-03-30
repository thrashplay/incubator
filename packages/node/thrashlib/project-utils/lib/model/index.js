"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _packageConfig = require("./package-config");

Object.keys(_packageConfig).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _packageConfig[key];
    }
  });
});

var _packageJson = require("./package-json");

Object.keys(_packageJson).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _packageJson[key];
    }
  });
});

var _project = require("./project");

Object.keys(_project).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _project[key];
    }
  });
});