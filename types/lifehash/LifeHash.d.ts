/// <reference types="node" />
import { Image } from './Image';
import { LifeHashVersion } from './types/LifeHashVersion';
export declare class LifeHash {
    static makeFrom(data: string | Uint8Array, version?: LifeHashVersion, module_size?: number, has_alpha?: boolean): Image;
    static makeFromDigest(digest: Uint8Array | Buffer, version?: LifeHashVersion, module_size?: number, has_alpha?: boolean): Image;
}
