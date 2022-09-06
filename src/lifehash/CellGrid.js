"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CellGrid = void 0;
const BitAggregator_1 = require("./BitAggregator");
const BitEnumerator_1 = require("./BitEnumerator");
const Grid_1 = require("./Grid");
const Point_1 = require("./Point");
const constants_1 = require("./constants");
class CellGrid extends Grid_1.Grid {
    constructor(size) {
        super(size);
        this.data = new BitAggregator_1.BitAggregator();
    }
    get_data() {
        const aggregator = new BitAggregator_1.BitAggregator();
        for (const point of this.get_points()) {
            aggregator.append(this.get_value(point));
        }
        return aggregator.get_data();
    }
    set_data(data) {
        const e = new BitEnumerator_1.BitEnumerator(data);
        let i = 0;
        while (e.has_next()) {
            this._storage[i] = e.next();
            i += 1;
        }
    }
    static is_alive_in_next_generation(current_alive, neighbors_count) {
        if (current_alive) {
            return [2, 3].includes(neighbors_count);
        }
        else {
            return neighbors_count == 3;
        }
    }
    count_neighbors(point) {
        let total = 0;
        for (const pointp of this.get_neighborhood(point)) {
            if (pointp[0].equals(new Point_1.Point(0, 0))) {
                continue;
            }
            if (this.get_value(pointp[1])) {
                total += 1;
            }
        }
        return total;
    }
    next_generation(current_change_grid, next_cell_grid, next_change_grid) {
        next_cell_grid.set_all(false);
        next_change_grid.set_all(false);
        for (const p of this.get_points()) {
            const current_alive = this.get_value(p);
            if (current_change_grid.get_value(p)) {
                const neighbors_count = this.count_neighbors(p);
                const next_alive = CellGrid.is_alive_in_next_generation(current_alive, neighbors_count);
                if (next_alive) {
                    next_cell_grid.set_value(true, p);
                }
                if (current_alive != next_alive) {
                    next_change_grid.set_changed(p);
                }
            }
            else {
                next_cell_grid.set_value(current_alive, p);
            }
        }
    }
    color_for_value(value) {
        if (value) {
            return constants_1.Colors.white;
        }
        else {
            return constants_1.Colors.black;
        }
    }
}
exports.CellGrid = CellGrid;
