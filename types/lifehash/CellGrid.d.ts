/// <reference types="node" />
import { BitAggregator } from './BitAggregator';
import { Grid } from './Grid';
import { Point } from './Point';
import { Size } from './Size';
import { ChangeGrid } from './ChangeGrid';
export declare class CellGrid extends Grid {
    data: BitAggregator;
    constructor(size: Size);
    get_data(): Uint8Array;
    set_data(data: number[] | (Uint8Array | Buffer)): void;
    static is_alive_in_next_generation(current_alive: boolean, neighbors_count: number): boolean;
    count_neighbors(point: Point): number;
    next_generation(current_change_grid: ChangeGrid, next_cell_grid: CellGrid, next_change_grid: ChangeGrid): void;
    color_for_value(value: boolean): import("./Color").Color;
}
