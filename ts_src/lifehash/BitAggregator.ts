export class BitAggregator {
  bitMask: number;

  private _data: number[];

  constructor() {
    this._data = [];
    this.bitMask = 0;
  }

  append(bit: boolean): void {
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
