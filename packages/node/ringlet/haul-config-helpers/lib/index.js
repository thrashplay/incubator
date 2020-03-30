"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fixWebpackConfig = require("./fix-webpack-config");

Object.keys(_fixWebpackConfig).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _fixWebpackConfig[key];
    }
  });
});