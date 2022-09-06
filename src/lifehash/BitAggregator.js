"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BitAggregator = void 0;
class BitAggregator {
    constructor() {
        this._data = [];
        this.bitMask = 0;
    }
    append(bit) {
        if (this.bitMask === 0) {
            this.bitMask = 128;
            this._data.push(0);
        }
        if (bit) {
            this._data[this._data.length - 1] |= this.bitMask;
        }
        this.bitMask >>= 1;
    }
    get_data() {
        return Uint8Array.from(this._data);
    }
}
exports.BitAggregator = BitAggregator;
