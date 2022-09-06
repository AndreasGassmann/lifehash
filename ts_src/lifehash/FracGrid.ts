import { CellGrid } from './CellGrid';
import { Color } from './Color';
import { Colors } from './constants';
import { Grid } from './Grid';
import { Size } from './Size';

export class FracGrid extends Grid<number> {
  constructor(size: Size) {
    super(size);
  }

  overlay(cell_grid: CellGrid, frac: number) {
    for (const point of this.get_points()) {
      if (cell_grid.get_value(point)) {
        this.set_value(frac, point);
      }
    }
  }

  color_for_value(value: number): Color {
    return Colors.black.lerp_to(Colors.white, value);
  }
}
