"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mapIf = require("./mapIf");

Object.keys(_mapIf).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _mapIf[key];
    }
  });
});

var _transformIf = require("./transformIf");

Object.keys(_transformIf).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _transformIf[key];
    }
  });
});