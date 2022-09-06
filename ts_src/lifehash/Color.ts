import { Colors } from './constants';
import { clamped } from './math-utils';

export class Color {
  r: number;
  g: number;
  b: number;

  constructor(r = 0, g = 0, b = 0) {
    [this.r, this.g, this.b] = [r, g, b];
  }

  static from_uint8_values(r: number, g: number, b: number): Color {
    return new this(r / 255, g / 255, b / 255);
  }

  lighten(t: number): Color {
    return this.lerp_to(Colors.white, t);
  }

  darken(t: number): Color {
    return this.lerp_to(Colors.black, t);
  }

  luminance(): number {
    return Math.sqrt(
      Math.pow(0.299 * this.r, 2) +
        Math.pow(0.587 * this.g, 2) +
        Math.pow(0.144 * this.b, 2),
    );
  }

  burn(t: number): Color {
    let f;
    f = Math.max(1.0 - t, 1e-7);
    return new Color(
      Math.min(1.0 - (1.0 - this.r) / f, 1.0),
      Math.min(1.0 - (1.0 - this.g) / f, 1.0),
      Math.min(1.0 - (1.0 - this.b) / f, 1.0),
    );
  }

  lerp_to(other: Color, t: number): Color {
    const f = clamped(t);
    const red = clamped(this.r * (1 - f) + other.r * f);
    const green = clamped(this.g * (1 - f) + other.g * f);
    const blue = clamped(this.b * (1 - f) + other.b * f);
    return new Color(red, green, blue);
  }
}
