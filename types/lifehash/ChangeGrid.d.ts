import { Color } from './Color';
import { Grid } from './Grid';
import { Point } from './Point';
export declare class ChangeGrid extends Grid {
    set_changed(point: Point): void;
    color_for_value(value: boolean): Color;
}
