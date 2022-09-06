import { BitEnumerator } from './BitEnumerator';
import { LifeHashVersion } from './types/LifeHashVersion';

export enum PatternType {
  snowflake = 0, // Mirror around central axes.
  pinwheel = 1, // Rotate around center.
  fiducial = 2, // Identity.
}

export class Pattern {
  static select_pattern(entropy: BitEnumerator, version: LifeHashVersion) {
    if (
      [LifeHashVersion.fiducial, LifeHashVersion.grayscale_fiducial].includes(
        version,
      )
    ) {
      return PatternType.fiducial;
    } else {
      if (entropy.next()) {
        return PatternType.snowflake;
      } else {
        return PatternType.pinwheel;
      }
    }
  }
}
