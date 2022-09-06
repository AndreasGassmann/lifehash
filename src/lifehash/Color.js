"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Color = void 0;
const constants_1 = require("./constants");
const math_utils_1 = require("./math-utils");
class Color {
    constructor(r = 0, g = 0, b = 0) {
        [this.r, this.g, this.b] = [r, g, b];
    }
    static from_uint8_values(r, g, b) {
        return new this(r / 255, g / 255, b / 255);
    }
    lighten(t) {
        return this.lerp_to(constants_1.Colors.white, t);
    }
    darken(t) {
        return this.lerp_to(constants_1.Colors.black, t);
    }
    luminance() {
        return Math.sqrt(Math.pow(0.299 * this.r, 2) +
            Math.pow(0.587 * this.g, 2) +
            Math.pow(0.144 * this.b, 2));
    }
    burn(t) {
        let f;
        f = Math.max(1.0 - t, 1e-7);
        return new Color(Math.min(1.0 - (1.0 - this.r) / f, 1.0), Math.min(1.0 - (1.0 - this.g) / f, 1.0), Math.min(1.0 - (1.0 - this.b) / f, 1.0));
    }
    lerp_to(other, t) {
        const f = (0, math_utils_1.clamped)(t);
        const red = (0, math_utils_1.clamped)(this.r * (1 - f) + other.r * f);
        const green = (0, math_utils_1.clamped)(this.g * (1 - f) + other.g * f);
        const blue = (0, math_utils_1.clamped)(this.b * (1 - f) + other.b * f);
        return new Color(red, green, blue);
    }
}
exports.Color = Color;
