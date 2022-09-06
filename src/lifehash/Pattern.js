"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pattern = exports.PatternType = void 0;
const LifeHashVersion_1 = require("./types/LifeHashVersion");
var PatternType;
(function (PatternType) {
    PatternType[PatternType["snowflake"] = 0] = "snowflake";
    PatternType[PatternType["pinwheel"] = 1] = "pinwheel";
    PatternType[PatternType["fiducial"] = 2] = "fiducial";
})(PatternType = exports.PatternType || (exports.PatternType = {}));
class Pattern {
    static select_pattern(entropy, version) {
        if ([LifeHashVersion_1.LifeHashVersion.fiducial, LifeHashVersion_1.LifeHashVersion.grayscale_fiducial].includes(version)) {
            return PatternType.fiducial;
        }
        else {
            if (entropy.next()) {
                return PatternType.snowflake;
            }
            else {
                return PatternType.pinwheel;
            }
        }
    }
}
exports.Pattern = Pattern;
