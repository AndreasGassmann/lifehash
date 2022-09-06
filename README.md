# LifeHash

[![GitHub Action](https://github.com/AndreasGassmann/lifehash/workflows/Build%2C%20Test%20and%20Analyze/badge.svg)](https://github.com/AndreasGassmann/lifehash/actions?query=workflow%3A%22Build%2C+Test+and+Analyze%22+branch%3Amain)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=AndreasGassmann_lifehash&metric=alert_status)](https://sonarcloud.io/dashboard?id=AndreasGassmann_lifehash)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=AndreasGassmann_lifehash&metric=coverage)](https://sonarcloud.io/dashboard?id=AndreasGassmann_lifehash)
[![npm](https://img.shields.io/npm/v/lifehash.svg?colorB=brightgreen)](https://www.npmjs.com/package/lifehash)

TypeScript/JavaScript implementation of [LifeHash](https://lifehash.info): A visual hash algorithm.

# DISCLAIMER

This project is in an early development phase and has not been audited or reviewed. Use it at your own risk.

Currently, only `version1` and `version2` lifehashes are supported.

## Description

LifeHash is a method of hash visualization based on Conway’s Game of Life that creates beautiful icons that are deterministic, yet distinct and unique given the input data.

The basic concept is to take a SHA-256 hash of the input data (which can be any data including another hash) and then use the 256-bit digest as a 16x16 pixel "seed" for running the cellular automata known as Conway’s Game of Life.

After the pattern becomes stable (or begins repeating) the resulting history is used to compile a grayscale image of all the states from the first to last generation. Using Game of Life provides visual structure to the resulting image, even though it was seeded with entropy.

Some bits of the initial hash are then used to deterministically apply symmetry and color to the icon to add beauty and quick recognizability.

Source: [https://lifehash.info/](https://lifehash.info/)

## Installation

```
npm install lifehash
```

## Example

```typescript
import { LifeHash, LifeHashVersion } from 'lifehash';

const lifehash = LifeHash.makeFrom(input, LifeHashVersion.version2, 1, true);

lifehash.toDataUrl(); // base64 image
```

For more examples, check the [examples](/examples/) folder or the [tests](/test/).

## Documentation

This library exports one class called `LifeHash`.

#### LifeHash

```typescript
class LifeHash {
  static makeFrom(
    data: string | Uint8Array,
    version = LifeHashVersion.version2,
    module_size = 1,
    has_alpha = false,
  ): Image {
    /* */
  }

  static makeFromDigest(
    digest: Uint8Array | Buffer,
    version = LifeHashVersion.version2,
    module_size = 1,
    has_alpha = false,
  ): Image {
    /* */
  }
}
```

## Testing

```bash

npm install
npm test

```

## TODOs

- [ ] Support remaining LifeHashVersions
- [ ] Add tests
- [ ] Enable Linting
- [ ] Fix sonarsource coverage not working
- [ ] Audit/review of library by 3rd party

## Dependencies

We try to use only a minimal set of dependencies to reduce the attack surface of malicious code being added by one of those dependencies.

There is only 1 (non-dev) dependency:

- [create-hash](https://www.npmjs.com/package/create-hash)

It is managed by [crypto-browserify](https://github.com/crypto-browserify).

## Usages

Currently, the following wallets support LifeHash:

- [AirGap Vault](https://github.com/airgap-it/airgap-vault)

## Credits

The project setup has been inspired by multiple bitcoinjs libraries, such as [bip39](https://www.npmjs.com/package/bip39) and [bip85](https://www.npmjs.com/package/bip85).

Original C++ implementation: https://github.com/BlockchainCommons/bc-lifehash

This implementation is heavily inspired by https://github.com/BlockchainCommons/bc-lifehash-python

## LICENSE

MIT
