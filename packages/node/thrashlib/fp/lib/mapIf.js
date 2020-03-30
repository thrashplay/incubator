"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mapIf = void 0;

var _fp = require("lodash/fp");

var _transformIf = require("./transformIf");

/**
 * Creates an array of values by iterating over the specified collection. For each item:
 *  - if `predicate` returns true for that item, the value will be transformed via `transform`
 *  - if `predicate` returns false for that item, the value will be unchanged
 */
const mapIf = (predicate, transform) => collection => {
  return (0, _fp.map)((0, _transformIf.transformIf)(predicate, transform))(collection);
};

exports.mapIf = mapIf;