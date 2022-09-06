import { createHash } from 'crypto';

export function reverse<T>(some_colorfunc: (t: number) => T): (t: number) => T {
  function reverse_anonfunc(t: number) {
    return some_colorfunc(1 - t);
  }

  return reverse_anonfunc;
}

export const sha256 = (value: string | Buffer | Uint8Array): Buffer => {
  return createHash('sha256').update(value).digest();
};
