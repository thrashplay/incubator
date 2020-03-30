"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createLogger = void 0;

const createLogger = () => {
  return {
    debug: console.log,
    error: console.error,
    info: console.log,
    warn: console.error
  };
};

exports.createLogger = createLogger;