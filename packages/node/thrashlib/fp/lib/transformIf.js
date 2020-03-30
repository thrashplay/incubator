"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transformIf = void 0;

/**
 * Transforms the input by invoking the specified transform function, if and only if `predicate`
 * returns true for the input. Otherwise, the input is returned unchanged.
 */
const transformIf = (predicate, transform) => value => {
  const res = predicate(value) ? transform(value) : value;
  return res;
};

exports.transformIf = transformIf;