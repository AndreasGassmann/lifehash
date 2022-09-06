export declare class Color {
    r: number;
    g: number;
    b: number;
    constructor(r?: number, g?: number, b?: number);
    static from_uint8_values(r: number, g: number, b: number): Color;
    lighten(t: number): Color;
    darken(t: number): Color;
    luminance(): number;
    burn(t: number): Color;
    lerp_to(other: Color, t: number): Color;
}
