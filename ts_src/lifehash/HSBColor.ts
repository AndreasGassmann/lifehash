import { Color } from './Color';
import { clamped, modulo } from './math-utils';

export class HSBColor {
  /*
  Only used in version1 lifehashes. Represents a color in the HSB space.
  */
  hue: number;
  saturation: number;
  brightness: number;

  constructor(hue: number, saturation = 1, brightness = 1) {
    this.hue = hue;
    this.saturation = saturation;
    this.brightness = brightness;
  }

  to_color() {
    const brightness = this.brightness;
    const saturation = this.saturation;
    const hue = this.hue;
    const v = clamped(brightness);
    const s = clamped(saturation);
    let [red, green, blue]: [number | null, number | null, number | null] = [
      null,
      null,
      null,
    ];

    if (s <= 0) {
      [red, green, blue] = [v, v, v];
    } else {
      let h = modulo(hue, 1);

      if (h < 0) {
        h += 1;
      }

      h *= 6;

      const i = Math.floor(h);
      const f = h - i;
      const p = v * (1 - s);
      const q = v * (1 - s * f);
      const t = v * (1 - s * (1 - f));

      if (i === 0) {
        [red, green, blue] = [v, t, p];
      } else {
        if (i === 1) {
          [red, green, blue] = [q, v, p];
        } else {
          if (i === 2) {
            [red, green, blue] = [p, v, t];
          } else {
            if (i === 3) {
              [red, green, blue] = [p, q, v];
            } else {
              if (i === 4) {
                [red, green, blue] = [t, p, v];
              } else {
                if (i === 5) {
                  [red, green, blue] = [v, p, q];
                } else {
                  throw new Error('Internal error.');
                }
              }
            }
          }
        }
      }
    }

    return new Color(red, green, blue);
  }

  static make_from_color(color: Color) {
    const [r, g, b] = [color.r, color.g, color.b];
    const max_value = Math.max(r, g, b);
    const min_value = Math.min(r, g, b);
    const brightness = max_value;
    const d = max_value - min_value;

    let saturation: number | null = null;

    if (max_value === 0) {
      saturation = 0;
    } else {
      saturation = d / max_value;
    }

    let hue: number | null = null;

    if (max_value === min_value) {
      hue = 0;
    } else {
      if (max_value === r) {
        hue = ((g - b) / d + (g < b ? 6 : 0)) / 6;
      } else {
        if (max_value === g) {
          hue = ((b - r) / d + 2) / 6;
        } else {
          if (max_value === b) {
            hue = ((r - g) / d + 4) / 6;
          } else {
            throw new Error('Internal error.');
          }
        }
      }
    }

    return new HSBColor(hue, saturation, brightness);
  }
}
