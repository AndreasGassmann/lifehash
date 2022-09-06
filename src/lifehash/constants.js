"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.spectrum_cmyk_safe = exports.spectrum_cmyk_safe_colors = exports.spectrum = exports.grayscale = exports.Colors = void 0;
const Color_1 = require("./Color");
const color_utils_1 = require("./color-utils");
exports.Colors = {
    black: new Color_1.Color(0, 0, 0),
    blue: new Color_1.Color(0, 0, 1),
    cyan: new Color_1.Color(0, 1, 1),
    green: new Color_1.Color(0, 1, 0),
    magenta: new Color_1.Color(1, 0, 1),
    red: new Color_1.Color(1, 0, 0),
    white: new Color_1.Color(1, 1, 1),
    yellow: new Color_1.Color(1, 1, 0),
};
exports.grayscale = (0, color_utils_1.blend)(exports.Colors.black, exports.Colors.white);
const spectrum_colors = [
    [0, 168, 222],
    [51, 51, 145],
    [233, 19, 136],
    [235, 45, 46],
    [253, 233, 43],
    [0, 158, 84],
    [0, 168, 222],
];
exports.spectrum = (0, color_utils_1.blend_many)(spectrum_colors.map((vals) => Color_1.Color.from_uint8_values(...vals)));
exports.spectrum_cmyk_safe_colors = [
    [0, 168, 222],
    [41, 60, 130],
    [210, 59, 130],
    [217, 63, 53],
    [244, 228, 81],
    [0, 158, 84],
    [0, 168, 222],
];
exports.spectrum_cmyk_safe = (0, color_utils_1.blend_many)(exports.spectrum_cmyk_safe_colors.map((vals) => Color_1.Color.from_uint8_values(...vals)));
