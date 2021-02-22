#!/usr/bin/env node

// Reference: https://github.com/felddy/foundryvtt-docker/blob/develop/src/set_password.js

const crypto = require("crypto");
const fs = require("fs");

const digest = "sha512";
const iterations = 1000;
const keylen = 64;
const low_sodium = "17c4f39053ac5a50d5797c665ad1f4e6";

var plaintext = fs.readFileSync(process.stdin.fd, "utf-8");
var cyphertext = crypto.pbkdf2Sync(
  plaintext.trim(),
  low_sodium,
  iterations,
  keylen,
  digest
);
process.stdout.write(cyphertext.toString("hex"));
