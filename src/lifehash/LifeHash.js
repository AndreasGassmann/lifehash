"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LifeHash = void 0;
const createHash = require("create-hash");
const BitEnumerator_1 = require("./BitEnumerator");
const CellGrid_1 = require("./CellGrid");
const ChangeGrid_1 = require("./ChangeGrid");
const ColorGrid_1 = require("./ColorGrid");
const FracGrid_1 = require("./FracGrid");
const Pattern_1 = require("./Pattern");
const Size_1 = require("./Size");
const Image_1 = require("./Image");
const LifeHashVersion_1 = require("./types/LifeHashVersion");
const utils_1 = require("./utils");
const color_utils_1 = require("./color-utils");
const math_utils_1 = require("./math-utils");
class LifeHash {
    static makeFrom(data, version = LifeHashVersion_1.LifeHashVersion.version2, module_size = 1, has_alpha = false) {
        /*
        Make a lifehash from raw data that hasn't been hashed yet.
        */
        if (typeof data === 'string') {
            data = new TextEncoder().encode(data);
        }
        else {
        }
        if (!(data instanceof Uint8Array)) {
            throw new Error('data must be utf-8 string or bytes');
        }
        const digest = createHash('sha256').update(data).digest();
        return this.makeFromDigest(digest, version, module_size, has_alpha);
    }
    static makeFromDigest(digest, version = LifeHashVersion_1.LifeHashVersion.version2, module_size = 1, has_alpha = false) {
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
        let length;
        let max_generations;
        let max_value;
        let min_value;
        let pattern;
        let value;
        let values;
        if (digest.length !== 32) {
            throw new Error('Digest must be 32 bytes.');
        }
        if ([LifeHashVersion_1.LifeHashVersion.version1, LifeHashVersion_1.LifeHashVersion.version2].includes(version)) {
            length = 16;
            max_generations = 150;
        }
        else {
            if ([
                LifeHashVersion_1.LifeHashVersion.detailed,
                LifeHashVersion_1.LifeHashVersion.fiducial,
                LifeHashVersion_1.LifeHashVersion.grayscale_fiducial,
            ].includes(version)) {
                length = 32;
                max_generations = 300;
            }
            else {
                throw new Error('Invalid version.');
            }
        }
        const size = new Size_1.Size(length, length);
        let current_cell_grid = new CellGrid_1.CellGrid(size);
        let next_cell_grid = new CellGrid_1.CellGrid(size);
        let current_change_grid = new ChangeGrid_1.ChangeGrid(size);
        let next_change_grid = new ChangeGrid_1.ChangeGrid(size);
        const history_set = new Set();
        const history = [];
        switch (version) {
            case LifeHashVersion_1.LifeHashVersion.version1:
                next_cell_grid.set_data(digest);
                break;
            case LifeHashVersion_1.LifeHashVersion.version2:
                // Ensure that .version2 in no way resembles .version1
                next_cell_grid.set_data((0, utils_1.sha256)(digest));
                break;
            case LifeHashVersion_1.LifeHashVersion.detailed:
            case LifeHashVersion_1.LifeHashVersion.fiducial:
            case LifeHashVersion_1.LifeHashVersion.grayscale_fiducial:
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
            current_cell_grid.next_generation(current_change_grid, next_cell_grid, next_change_grid);
        }
        frac_grid = new FracGrid_1.FracGrid(size);
        for (let i = 0; i < history.length; i += 1) {
            current_cell_grid.set_data(history[i]);
            frac = (0, math_utils_1.clamped)((0, math_utils_1.lerp_from)(0, history.length, i + 1));
            frac_grid.overlay(current_cell_grid, frac);
        }
        if (version !== LifeHashVersion_1.LifeHashVersion.version1) {
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
                value = (0, math_utils_1.lerp_from)(min_value, max_value, current_value);
                frac_grid.set_value(value, point);
            }
        }
        entropy = new BitEnumerator_1.BitEnumerator(digest);
        // if (version === LifeHashVersion.detailed) {
        //   entropy.next();
        // } else {
        if (version === LifeHashVersion_1.LifeHashVersion.version2) {
            entropy.next();
            entropy.next();
        }
        // }
        gradient = (0, color_utils_1.select_gradient)(entropy, version);
        pattern = Pattern_1.Pattern.select_pattern(entropy, version);
        color_grid = new ColorGrid_1.ColorGrid(frac_grid, gradient, pattern);
        colors = color_grid.colors();
        image = Image_1.Image.make_image(color_grid.size.width, color_grid.size.height, colors, module_size, has_alpha);
        return image;
    }
}
exports.LifeHash = LifeHash;
