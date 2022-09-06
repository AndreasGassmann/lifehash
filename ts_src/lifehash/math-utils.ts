export function lerp_to(toA: number, toB: number, t: number): number {
  /*
    Interpolate t from [0..1] to [a..b].
    */
  return t * (toB - toA) + toA;
}

export function lerp_from(fromA: number, fromB: number, t: number): number {
  /*
    Interpolate t from [a..b] to [0..1].
    */
  return (fromA - t) / (fromA - fromB);
}

export function lerp(
  fromA: number,
  fromB: number,
  toC: number,
  toD: number,
  t: number,
): number {
  return lerp_to(toC, toD, lerp_from(fromA, fromB, t));
}

export function clamped(n: number): number {
  /*
    Return n clamped to the range [0..1].
    */
  return Math.max(Math.min(n, 1), 0);
}

// TODO: Is this needed?
export function modulo(dividend: number, divisor: number): number {
  return ((dividend % divisor) + divisor) % divisor;
}
