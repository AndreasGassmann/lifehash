import { Color } from './Color';
export declare class HSBColor {
    hue: number;
    saturation: number;
    brightness: number;
    constructor(hue: number, saturation?: number, brightness?: number);
    to_color(): Color;
    static make_from_color(color: Color): HSBColor;
}
