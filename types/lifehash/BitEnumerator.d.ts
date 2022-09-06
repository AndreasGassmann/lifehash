/// <reference types="node" />
export declare class BitEnumerator {
    private data;
    private index;
    private mask;
    constructor(data: number[] | (Uint8Array | Buffer));
    has_next(): boolean;
    next(): boolean;
    next_configurable(bitMask: number, bits: number): number;
    next_uint2(): number;
    next_uint8(): number;
    next_uint16(): number;
    next_frac(): number;
}
