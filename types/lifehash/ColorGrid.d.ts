import { Color } from './Color';
import { FracGrid } from './FracGrid';
import { Grid } from './Grid';
import { PatternType } from './Pattern';
import { Point } from './Point';
import { Size } from './Size';
import { Transform } from './Transform';
export declare class ColorGrid extends Grid<Color> {
    static snowflake_transforms: Transform[];
    static pinwheel_transforms: Transform[];
    static fiducial_transforms: Transform[];
    static transforms_map: {
        0: Transform[];
        1: Transform[];
        2: Transform[];
    };
    constructor(frac_grid: FracGrid, gradient: (t: number) => Color, pattern: PatternType);
    color_for_value(color: Color): Color;
    static target_size(in_size: Size, pattern: PatternType): Size;
    transform_point(point: Point, transform: Transform): Point;
    draw(point: Point, color: Color, transforms: Transform[]): void;
}
