import { BitEnumerator } from './BitEnumerator';
import { LifeHashVersion } from './types/LifeHashVersion';
export declare enum PatternType {
    snowflake = 0,
    pinwheel = 1,
    fiducial = 2
}
export declare class Pattern {
    static select_pattern(entropy: BitEnumerator, version: LifeHashVersion): PatternType;
}
