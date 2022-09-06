import { CellGrid } from './CellGrid';
import { Color } from './Color';
import { Grid } from './Grid';
import { Size } from './Size';
export declare class FracGrid extends Grid<number> {
    constructor(size: Size);
    overlay(cell_grid: CellGrid, frac: number): void;
    color_for_value(value: number): Color;
}
