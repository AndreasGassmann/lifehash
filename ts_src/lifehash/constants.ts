import { Color } from './Color';
import { blend, blend_many } from './color-utils';

export const Colors = {
  black: new Color(0, 0, 0),
  blue: new Color(0, 0, 1),
  cyan: new Color(0, 1, 1),
  green: new Color(0, 1, 0),
  magenta: new Color(1, 0, 1),
  red: new Color(1, 0, 0),
  white: new Color(1, 1, 1),
  yellow: new Color(1, 1, 0),
};

export const grayscale = blend(Colors.black, Colors.white);

const spectrum_colors: [number, number, number][] = [
  [0, 168, 222],
  [51, 51, 145],
  [233, 19, 136],
  [235, 45, 46],
  [253, 233, 43],
  [0, 158, 84],
  [0, 168, 222],
];

export const spectrum = blend_many(
  spectrum_colors.map((vals) => Color.from_uint8_values(...vals)),
);

export const spectrum_cmyk_safe_colors: [number, number, number][] = [
  [0, 168, 222],
  [41, 60, 130],
  [210, 59, 130],
  [217, 63, 53],
  [244, 228, 81],
  [0, 158, 84],
  [0, 168, 222],
];

export const spectrum_cmyk_safe = blend_many(
  spectrum_cmyk_safe_colors.map((vals) => Color.from_uint8_values(...vals)),
);
