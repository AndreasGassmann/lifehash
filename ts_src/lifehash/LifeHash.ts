import * as createHash from 'create-hash';
import { BitEnumerator } from './BitEnumerator';
import { CellGrid } from './CellGrid';
import { ChangeGrid } from './ChangeGrid';
import { ColorGrid } from './ColorGrid';
import { FracGrid } from './FracGrid';
import { Pattern } from './Pattern';
import { Size } from './Size';
import { Image } from './Image';
import { LifeHashVersion } from './types/LifeHashVersion';
import { sha256 } from './utils';
import { select_gradient } from './color-utils';
import { clamped, lerp_from } from './math-utils';

export class LifeHash {
  static makeFrom(
    data: string | Uint8Array,
    version = LifeHashVersion.version2,
    module_size = 1,
    has_alpha = false,
  ): Image {
    /*
    Make a lifehash from raw data that hasn't been hashed yet.
    */

    if (typeof data === 'string') {
      data = new TextEncoder().encode(data);
    } else {
    }

    if (!(data instanceof Uint8Array)) {
      throw new Error('data must be utf-8 string or bytes');
    }

    const digest = createHash('sha256').update(data).digest();

    return this.makeFromDigest(digest, version, module_size, has_alpha);
  }

  static makeFromDigest(
    digest: Uint8Array | Buffer,
    version = LifeHashVersion.version2,
    module_size = 1,
    has_alpha = false,
  ): Image {
    /*
    Make a lifehash from a 32-byte hash digest.
    */
    let _hash;
    let color_grid;
    let colors;
    let current_value;
    let data;
    // let digest1;
    // let digest2;
    // let digest3;
    // let digest4;
    let entropy;
    let frac;
    let frac_grid;
    let gradient;
    let image;
    let length: number;
    let max_generations: number;
    let max_value;
    let min_value;
    let pattern;
    let value;
    let values;

    if (digest.length !== 32) {
      throw new Error('Digest must be 32 bytes.');
    }

    if (
      [LifeHashVersion.version1, LifeHashVersion.version2].includes(version)
    ) {
      length = 16;
      max_generations = 150;
    } else {
      if (
        [
          LifeHashVersion.detailed,
          LifeHashVersion.fiducial,
          LifeHashVersion.grayscale_fiducial,
        ].includes(version)
      ) {
        length = 32;
        max_generations = 300;
      } else {
        throw new Error('Invalid version.');
      }
    }

    const size = new Size(length, length);

    let current_cell_grid = new CellGrid(size);

    let next_cell_grid = new CellGrid(size);

    let current_change_grid = new ChangeGrid(size);
    let next_change_grid = new ChangeGrid(size);

    const history_set: Set<string> = new Set();
    const history: Uint8Array[] = [];

    switch (version) {
      case LifeHashVersion.version1:
        next_cell_grid.set_data(digest);
        break;
      case LifeHashVersion.version2:
        // Ensure that .version2 in no way resembles .version1
        next_cell_grid.set_data(sha256(digest));
        break;
      case LifeHashVersion.detailed:
      case LifeHashVersion.fiducial:
      case LifeHashVersion.grayscale_fiducial:
        throw new Error('Not implemented');

      // digest1 = createHash('sha256').update(digest);

      // if (version === LifeHashVersion.grayscale_fiducial) {
      //   digest1 = createHash('sha256').update(digest1.digest());
      // }

      // digest2 = sha256(digest1.digest());
      // digest3 = sha256(digest2);
      // digest4 = sha256(digest3);

      // const digest_final = createHash('sha256').update(digest);
      // digest_final.update(digest2);
      // digest_final.update(digest3);
      // digest_final.update(digest4);

      // next_cell_grid.set_data(digest_final.digest());
    }

    next_change_grid.set_all(true);

    while (history.length < max_generations) {
      [current_cell_grid, next_cell_grid] = [next_cell_grid, current_cell_grid];
      [current_change_grid, next_change_grid] = [
        next_change_grid,
        current_change_grid,
      ];

      data = current_cell_grid.get_data();

      _hash = createHash('sha256').update(data);

      const _hashDigest = _hash.digest();

      if (history_set.has(_hashDigest.toString())) {
        break;
      }

      history_set.add(_hashDigest.toString());
      history.push(data);

      current_cell_grid.next_generation(
        current_change_grid,
        next_cell_grid,
        next_change_grid,
      );
    }
    frac_grid = new FracGrid(size);

    for (let i = 0; i < history.length; i += 1) {
      current_cell_grid.set_data(history[i]);

      frac = clamped(lerp_from(0, history.length, i + 1));
      frac_grid.overlay(current_cell_grid, frac);
    }

    if (version !== LifeHashVersion.version1) {
      min_value = null;
      max_value = null;
      values = [];

      for (const point of frac_grid.get_points()) {
        value = frac_grid.get_value(point);
        values.push(value);
      }

      min_value = Math.min(...values);
      max_value = Math.max(...values);

      for (const point of frac_grid.get_points()) {
        current_value = frac_grid.get_value(point);
        value = lerp_from(min_value, max_value, current_value);
        frac_grid.set_value(value, point);
      }
    }

    entropy = new BitEnumerator(digest);

    // if (version === LifeHashVersion.detailed) {
    //   entropy.next();
    // } else {
    //   if (version === LifeHashVersion.version2) {
    //     entropy.next();
    //     entropy.next();
    //   }
    // }

    gradient = select_gradient(entropy, version);
    pattern = Pattern.select_pattern(entropy, version);

    color_grid = new ColorGrid(frac_grid, gradient, pattern);

    colors = color_grid.colors();

    image = Image.make_image(
      color_grid.size.width,
      color_grid.size.height,
      colors,
      module_size,
      has_alpha,
    );
    return image;
  }
}
