import { BitEnumerator } from './BitEnumerator';
import { Color } from './Color';
import { LifeHashVersion } from './types/LifeHashVersion';
export declare function blend(color1: Color, color2: Color): (t: number) => Color;
export declare function blend_many(colors: Color[]): (t: number) => Color;
export declare function select_gradient(entropy: BitEnumerator, version: LifeHashVersion): (t: number) => Color;
