import { Point } from './Point';
import { Size } from './Size';
import { Color } from './Color';
export declare class Grid<T = boolean> {
    size: Size;
    protected _storage: T[];
    protected _maxX: number;
    protected _maxY: number;
    private _capacity;
    constructor(size: Size);
    _offset(point: Point): number;
    circular_index(index: number, modulus: number): number;
    set_all(value: boolean): void;
    set_value(value: T, point: Point): void;
    get_value(point: Point): T;
    get_points(): Generator<Point, void, unknown>;
    get_neighborhood(point: Point): Generator<Point[], void, unknown>;
    color_for_value(value: T): Color;
    colors(): number[];
}
