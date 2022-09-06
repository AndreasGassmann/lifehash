"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Point = void 0;
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    equals(other) {
        if (other instanceof Point) {
            return other.x === this.x && other.y === this.y;
        }
        else {
            return other === this;
        }
    }
}
exports.Point = Point;
