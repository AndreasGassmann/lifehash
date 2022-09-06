"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sha256 = exports.toHexString = void 0;
const createHash = require("create-hash");
const toHexString = (bytes) => bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');
exports.toHexString = toHexString;
const sha256 = (value) => {
    return createHash('sha256').update(value).digest();
};
exports.sha256 = sha256;
