"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.modulo = exports.clamped = exports.lerp = exports.lerp_from = exports.lerp_to = void 0;
function lerp_to(toA, toB, t) {
    /*
      Interpolate t from [0..1] to [a..b].
      */
    return t * (toB - toA) + toA;
}
exports.lerp_to = lerp_to;
function lerp_from(fromA, fromB, t) {
    /*
      Interpolate t from [a..b] to [0..1].
      */
    return (fromA - t) / (fromA - fromB);
}
exports.lerp_from = lerp_from;
function lerp(fromA, fromB, toC, toD, t) {
    return lerp_to(toC, toD, lerp_from(fromA, fromB, t));
}
exports.lerp = lerp;
function clamped(n) {
    /*
      Return n clamped to the range [0..1].
      */
    return Math.max(Math.min(n, 1), 0);
}
exports.clamped = clamped;
// TODO: Is this needed?
function modulo(dividend, divisor) {
    return ((dividend % divisor) + divisor) % divisor;
}
exports.modulo = modulo;
