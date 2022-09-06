import { BitAggregator } from './BitAggregator';
import { BitEnumerator } from './BitEnumerator';
import { Grid } from './Grid';
import { Point } from './Point';
import { Size } from './Size';
import { Colors } from './constants';
import { ChangeGrid } from './ChangeGrid';

export class CellGrid extends Grid {
  /*
  A class that holds an array of boolean cells and that is capable of running
  Conway's Game of Life to produce the next generation.
  */
  data: BitAggregator;

  constructor(size: Size) {
    super(size);
    this.data = new BitAggregator();
  }

  get_data(): Uint8Array {
    const aggregator = new BitAggregator();

    for (const point of this.get_points()) {
      aggregator.append(this.get_value(point));
    }

    return aggregator.get_data();
  }

  set_data(data: number[] | (Uint8Array | Buffer)): void {
    const e = new BitEnumerator(data);

    let i = 0;

    while (e.has_next()) {
      this._storage[i] = e.next();
      i += 1;
    }
  }

  static is_alive_in_next_generation(
    current_alive: boolean,
    neighbors_count: number,
  ) {
    if (current_alive) {
      return [2, 3].includes(neighbors_count);
    } else {
      return neighbors_count == 3;
    }
  }

  count_neighbors(point: Point) {
    let total = 0;

    for (const pointp of this.get_neighborhood(point)) {
      if (pointp[0].equals(new Point(0, 0))) {
        continue;
      }

      if (this.get_value(pointp[1])) {
        total += 1;
      }
    }

    return total;
  }

  next_generation(
    current_change_grid: ChangeGrid,
    next_cell_grid: CellGrid,
    next_change_grid: ChangeGrid,
  ) {
    next_cell_grid.set_all(false);
    next_change_grid.set_all(false);

    for (const p of this.get_points()) {
      const current_alive = this.get_value(p);
      if (current_change_grid.get_value(p)) {
        const neighbors_count = this.count_neighbors(p);

        const next_alive = CellGrid.is_alive_in_next_generation(
          current_alive,
          neighbors_count,
        );
        if (next_alive) {
          next_cell_grid.set_value(true, p);
        }
        if (current_alive != next_alive) {
          next_change_grid.set_changed(p);
        }
      } else {
        next_cell_grid.set_value(current_alive, p);
      }
    }
  }

  color_for_value(value: boolean) {
    if (value) {
      return Colors.white;
    } else {
      return Colors.black;
    }
  }
}
