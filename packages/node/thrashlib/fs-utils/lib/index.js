"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.directoryExists = exports.fileExists = exports.pathExists = void 0;

var _fs = require("fs");

var _lodash = require("lodash");

/**
 * Returns a Promise that resolves to `true` if the given path exists, or false otherwise.
 * If provided, the second argument is a function to check the `fs.Stats` object. If that
 * function is not specified or returns true for an existing path, this function will return 
 * true. If the function returns false, then this function will return false.
 * 
 * @param path the path to check
 */
const pathExists = (path, predicate) => {
  return _fs.promises.stat(path).then(stats => (0, _lodash.isNil)(predicate) || predicate(stats)).catch(error => {
    // if stat called failed because file doesn't exist, just return false
    if (error.code === 'ENOENT') {
      return false;
    } // otherwise we have some FS access problem, and rethrow


    throw error;
  });
};
/**
 * Returns a Promise that resolves to `true` if the given path exists and is a regular file
 * or false otherwise.
 * @param path the path to check
 */


exports.pathExists = pathExists;

const fileExists = path => pathExists(path, stats => stats.isFile());
/**
 * Returns a Promise that resolves to `true` if the given path exists and is a directory or
 * false otherwise.
 * @param path the path to check
 */


exports.fileExists = fileExists;

const directoryExists = path => pathExists(path, stats => stats.isDirectory());

exports.directoryExists = directoryExists;