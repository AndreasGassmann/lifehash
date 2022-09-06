import { Color } from './Color';
export declare const Colors: {
    black: Color;
    blue: Color;
    cyan: Color;
    green: Color;
    magenta: Color;
    red: Color;
    white: Color;
    yellow: Color;
};
export declare const grayscale: (t: number) => Color;
export declare const spectrum: (t: number) => Color;
export declare const spectrum_cmyk_safe_colors: [number, number, number][];
export declare const spectrum_cmyk_safe: (t: number) => Color;
