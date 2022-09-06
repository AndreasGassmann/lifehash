"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sha256 = exports.reverse = void 0;
const crypto_1 = require("crypto");
function reverse(some_colorfunc) {
    function reverse_anonfunc(t) {
        return some_colorfunc(1 - t);
    }
    return reverse_anonfunc;
}
exports.reverse = reverse;
const sha256 = (value) => {
    return (0, crypto_1.createHash)('sha256').update(value).digest();
};
exports.sha256 = sha256;
