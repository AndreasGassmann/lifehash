export declare class Bitmap {
    width: number;
    height: number;
    pixel: [number, number, number, number][][];
    constructor(width: number, height: number);
    subsample(n: number): void;
    dataURL(): string;
}
