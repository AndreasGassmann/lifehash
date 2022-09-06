export class Point {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  equals(other: Point | unknown) {
    if (other instanceof Point) {
      return other.x === this.x && other.y === this.y;
    } else {
      return other === this;
    }
  }
}
