import { Color } from './Color';
import { FracGrid } from './FracGrid';
import { Grid } from './Grid';
import { PatternType } from './Pattern';
import { Point } from './Point';
import { Size } from './Size';
import { Transform } from './Transform';

export class ColorGrid extends Grid<Color> {
  /*
  A class that takes a grayscale grid and applies color and symmetry to it to
  yield the finished LifeHash.
  */
  static snowflake_transforms = [
    new Transform(false, false, false),
    new Transform(false, true, false),
    new Transform(false, false, true),
    new Transform(false, true, true),
  ];

  static pinwheel_transforms = [
    new Transform(false, false, false),
    new Transform(true, true, false),
    new Transform(true, false, true),
    new Transform(false, true, true),
  ];

  static fiducial_transforms = [new Transform(false, false, false)];

  static transforms_map = {
    0: this.snowflake_transforms,
    1: this.pinwheel_transforms,
    2: this.fiducial_transforms,
  };

  constructor(
    frac_grid: FracGrid,
    gradient: (t: number) => Color,
    pattern: PatternType,
  ) {
    let transforms: Transform[];

    super(ColorGrid.target_size(frac_grid.size, pattern));

    if (Object.keys(ColorGrid.transforms_map).includes(pattern.toString())) {
      transforms = ColorGrid.transforms_map[pattern];
    } else {
      transforms = [];
    }

    for (const point of frac_grid.get_points()) {
      const value = frac_grid.get_value(point);
      const some_color = gradient(value);
      this.draw(point, some_color, transforms);
    }
  }

  color_for_value(color: Color): Color {
    return color;
  }

  static target_size(in_size: Size, pattern: PatternType) {
    let multiplier;

    if (pattern === PatternType.fiducial) {
      multiplier = 1;
    } else {
      multiplier = 2;
    }

    return new Size(in_size.width * multiplier, in_size.height * multiplier);
  }

  transform_point(point: Point, transform: Transform) {
    let result;
    result = new Point(point.x, point.y);

    if (transform.transpose) {
      [result.x, result.y] = [result.y, result.x];
    }

    if (transform.reflect_x) {
      result.x = this._maxX - result.x;
    }

    if (transform.reflect_y) {
      result.y = this._maxY - result.y;
    }

    return result;
  }

  draw(point: Point, color: Color, transforms: Transform[]) {
    let p2;

    for (const transform of transforms) {
      p2 = this.transform_point(point, transform);
      this.set_value(color, p2);
    }
  }
}
