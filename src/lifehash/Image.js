"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Image = void 0;
const bitmap_1 = require("../bitmap");
const math_utils_1 = require("./math-utils");
class Image {
    constructor(width, height, colors) {
        this.width = width;
        this.height = height;
        this.colors = colors;
    }
    static make_image(width, height, colors, module_size, has_alpha) {
        if (module_size === 0) {
            throw new Error('Invalid module size.');
        }
        const scaled_width = width * module_size;
        const scaled_height = height * module_size;
        let result_components = null;
        if (has_alpha) {
            result_components = 4;
        }
        else {
            result_components = 3;
        }
        const result_colors = [];
        for (let target_y = 0; target_y < scaled_width; target_y += 1) {
            for (let target_x = 0; target_x < scaled_height; target_x += 1) {
                const source_x = target_x / module_size;
                const source_y = target_y / module_size;
                const source_offset = (source_y * width + source_x) * 3;
                const target_offset = (target_y * scaled_width + target_x) * result_components;
                result_colors[target_offset] = Math.floor((0, math_utils_1.clamped)(colors[source_offset]) * 255);
                result_colors[target_offset + 1] = Math.floor((0, math_utils_1.clamped)(colors[source_offset + 1]) * 255);
                result_colors[target_offset + 2] = Math.floor((0, math_utils_1.clamped)(colors[source_offset + 2]) * 255);
                if (has_alpha) {
                    result_colors[target_offset + 3] = 255;
                }
            }
        }
        return new Image(scaled_width, scaled_height, [
            ...Object.values(result_colors),
        ]);
    }
    toDataUrl() {
        const bmp = new bitmap_1.Bitmap(this.width, this.height);
        for (var i = 0; i < bmp.height; i++) {
            for (var j = 0; j < bmp.width; j++) {
                const offset = i * 4 + j * bmp.height * 4;
                const r = this.colors[offset];
                const g = this.colors[offset + 1];
                const b = this.colors[offset + 2];
                const a = this.colors[offset + 3];
                bmp.pixel[i][j] = [r / 255, g / 255, b / 255, a / 255];
            }
        }
        return bmp.dataURL();
    }
}
exports.Image = Image;
