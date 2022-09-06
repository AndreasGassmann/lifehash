export declare class Image {
    width: number;
    height: number;
    colors: number[];
    constructor(width: number, height: number, colors: number[]);
    static make_image(width: number, height: number, colors: number[], module_size: number, has_alpha: boolean): Image;
    toDataUrl(): string;
}
