import { Color } from './Color';
import { Colors } from './constants';
import { Grid } from './Grid';
import { Point } from './Point';

export class ChangeGrid extends Grid {
  set_changed(point: Point): void {
    for (const pointp of this.get_neighborhood(point)) {
      this.set_value(true, pointp[1]);
    }
  }

  color_for_value(value: boolean): Color {
    if (value) {
      return Colors.red;
    } else {
      return Colors.blue;
    }
  }
}
