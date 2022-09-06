"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangeGrid = void 0;
const constants_1 = require("./constants");
const Grid_1 = require("./Grid");
class ChangeGrid extends Grid_1.Grid {
    set_changed(point) {
        for (const pointp of this.get_neighborhood(point)) {
            this.set_value(true, pointp[1]);
        }
    }
    color_for_value(value) {
        if (value) {
            return constants_1.Colors.red;
        }
        else {
            return constants_1.Colors.blue;
        }
    }
}
exports.ChangeGrid = ChangeGrid;
