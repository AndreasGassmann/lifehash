"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Grid = void 0;
const Point_1 = require("./Point");
const constants_1 = require("./constants");
class Grid {
    constructor(size) {
        this.size = size;
        this._capacity = size.width * size.height;
        this._storage = Array(this._capacity).fill(0);
        this._maxX = size.width - 1;
        this._maxY = size.height - 1;
    }
    _offset(point) {
        return point.y * this.size.width + point.x;
    }
    circular_index(index, modulus) {
        return (index + modulus) % modulus;
    }
    set_all(value) {
        this._storage = Array(this._capacity).fill(value);
    }
    set_value(value, point) {
        const offset = this._offset(point);
        this._storage[offset] = value;
    }
    get_value(point) {
        return this._storage[this._offset(point)];
    }
    *get_points() {
        for (let y = 0; y < this._maxY + 1; y += 1) {
            for (let x = 0; x < this._maxX + 1; x += 1) {
                yield new Point_1.Point(x, y);
            }
        }
    }
    *get_neighborhood(point) {
        const point_pairs = [];
        for (let oy = -1; oy <= 1; oy += 1) {
            for (let ox = -1; ox <= 1; ox += 1) {
                const o = new Point_1.Point(ox, oy);
                const px = this.circular_index(ox + point.x, this.size.width);
                const py = this.circular_index(oy + point.y, this.size.height);
                const p = new Point_1.Point(px, py);
                point_pairs.push([o, p]);
                yield [o, p];
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
    colors() {
        const result = [];
        for (const color_value of this._storage) {
            const color = this.color_for_value(color_value);
            result.push(color.r);
            result.push(color.g);
            result.push(color.b);
        }
        return result;
    }
}
exports.Grid = Grid;
