export class BitEnumerator {
  private data: number[] | (Uint8Array | Buffer);
  private index: number;
  private mask: number;

  constructor(data: number[] | (Uint8Array | Buffer)) {
    this.data = data;
    this.index = 0;
    this.mask = 128;
  }

  has_next(): boolean {
    return this.mask !== 0 || this.index !== this.data.length - 1;
  }

  next(): boolean {
    if (!this.has_next()) {
      throw new Error('BitEnumerator underflow.');
    }

    if (this.mask === 0) {
      this.mask = 128;
      this.index += 1;
    }

    const b = (this.data[this.index] & this.mask) !== 0;
    this.mask >>= 1;
    return b;
  }

  next_configurable(bitMask: number, bits: number): number {
    let value = 0;

    for (let i = 0; i < bits; i += 1) {
      if (this.next()) {
        value |= bitMask;
      }

      bitMask >>= 1;
    }

    return value;
  }

  next_uint2(): number {
    const bitMask = 2;
    return this.next_configurable(bitMask, 2);
  }

  next_uint8(): number {
    const bitMask = 128;
    return this.next_configurable(bitMask, 8);
  }

  next_uint16(): number {
    const bitMask = 32768;
    return this.next_configurable(bitMask, 16);
  }

  next_frac() {
    return this.next_uint16() / 65535.0;
  }
}
