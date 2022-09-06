export declare class BitAggregator {
    bitMask: number;
    private _data;
    constructor();
    append(bit: boolean): void;
    get_data(): Uint8Array;
}
