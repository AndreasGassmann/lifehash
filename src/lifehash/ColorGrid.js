"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColorGrid = void 0;
const Grid_1 = require("./Grid");
const Pattern_1 = require("./Pattern");
const Point_1 = require("./Point");
const Size_1 = require("./Size");
const Transform_1 = require("./Transform");
class ColorGrid extends Grid_1.Grid {
    constructor(frac_grid, gradient, pattern) {
        let transforms;
        super(ColorGrid.target_size(frac_grid.size, pattern));
        if (Object.keys(ColorGrid.transforms_map).includes(pattern.toString())) {
            transforms = ColorGrid.transforms_map[pattern];
        }
        else {
            transforms = [];
        }
        for (const point of frac_grid.get_points()) {
            const value = frac_grid.get_value(point);
            const some_color = gradient(value);
            this.draw(point, some_color, transforms);
        }
    }
    color_for_value(color) {
        return color;
    }
    static target_size(in_size, pattern) {
        let multiplier;
        if (pattern === Pattern_1.PatternType.fiducial) {
            multiplier = 1;
        }
        else {
            multiplier = 2;
        }
        return new Size_1.Size(in_size.width * multiplier, in_size.height * multiplier);
    }
    transform_point(point, transform) {
        let result;
        result = new Point_1.Point(point.x, point.y);
        if (transform.transpose) {
            [result.x, result.y] = [result.y, result.x];
        }
        if (transform.reflect_x) {
            result.x = this._maxX - result.x;
        }
        if (transform.reflect_y) {
            result.y = this._maxY - result.y;
        }
        return result;
    }
    draw(point, color, transforms) {
        let p2;
        for (const transform of transforms) {
            p2 = this.transform_point(point, transform);
            this.set_value(color, p2);
        }
    }
}
exports.ColorGrid = ColorGrid;
_a = ColorGrid;
/*
A class that takes a grayscale grid and applies color and symmetry to it to
yield the finished LifeHash.
*/
ColorGrid.snowflake_transforms = [
    new Transform_1.Transform(false, false, false),
    new Transform_1.Transform(false, true, false),
    new Transform_1.Transform(false, false, true),
    new Transform_1.Transform(false, true, true),
];
ColorGrid.pinwheel_transforms = [
    new Transform_1.Transform(false, false, false),
    new Transform_1.Transform(true, true, false),
    new Transform_1.Transform(true, false, true),
    new Transform_1.Transform(false, true, true),
];
ColorGrid.fiducial_transforms = [new Transform_1.Transform(false, false, false)];
ColorGrid.transforms_map = {
    0: _a.snowflake_transforms,
    1: _a.pinwheel_transforms,
    2: _a.fiducial_transforms,
};
