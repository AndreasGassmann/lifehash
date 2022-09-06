import { Point } from './Point';
import { Size } from './Size';
import { Color } from './Color';
import { Colors } from './constants';

export class Grid<T = boolean> {
  size: Size;

  protected _storage: T[];

  protected _maxX: number;
  protected _maxY: number;

  private _capacity: number;

  constructor(size: Size) {
    this.size = size;
    this._capacity = size.width * size.height;
    this._storage = Array(this._capacity).fill(0);
    this._maxX = size.width - 1;
    this._maxY = size.height - 1;
  }

  _offset(point: Point): number {
    return point.y * this.size.width + point.x;
  }

  circular_index(index: number, modulus: number): number {
    return (index + modulus) % modulus;
  }

  set_all(value: boolean): void {
    this._storage = Array(this._capacity).fill(value);
  }

  set_value(value: T, point: Point): void {
    const offset = this._offset(point);
    this._storage[offset] = value;
  }

  get_value(point: Point): T {
    return this._storage[this._offset(point)];
  }

  *get_points(): Generator<Point, void, unknown> {
    for (let y = 0; y < this._maxY + 1; y += 1) {
      for (let x = 0; x < this._maxX + 1; x += 1) {
        yield new Point(x, y);
      }
    }
  }

  *get_neighborhood(point: Point): Generator<Point[], void, unknown> {
    const point_pairs = [];

    for (let oy = -1; oy <= 1; oy += 1) {
      for (let ox = -1; ox <= 1; ox += 1) {
        const o = new Point(ox, oy);
        const px = this.circular_index(ox + point.x, this.size.width);
        const py = this.circular_index(oy + point.y, this.size.height);
        const p = new Point(px, py);
        point_pairs.push([o, p]);
        yield [o, p];
      }
    }
  }

  color_for_value(value: T): Color {
    if (value) {
      return Colors.white;
    } else {
      return Colors.black;
    }
  }

  colors(): number[] {
    const result: number[] = [];

    for (const color_value of this._storage) {
      const color = this.color_for_value(color_value);
      result.push(color.r);
      result.push(color.g);
      result.push(color.b);
    }

    return result;
  }
}
