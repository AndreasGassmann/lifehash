"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FracGrid = void 0;
const constants_1 = require("./constants");
const Grid_1 = require("./Grid");
class FracGrid extends Grid_1.Grid {
    constructor(size) {
        super(size);
    }
    overlay(cell_grid, frac) {
        for (const point of this.get_points()) {
            if (cell_grid.get_value(point)) {
                this.set_value(frac, point);
            }
        }
    }
    color_for_value(value) {
        return constants_1.Colors.black.lerp_to(constants_1.Colors.white, value);
    }
}
exports.FracGrid = FracGrid;
