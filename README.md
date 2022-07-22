# quadbin-js

The `quadbin-js` is a TypeScript library for working with the [Quadbin](https://docs.carto.com/analytics-toolbox-bigquery/overview/spatial-indexes/) spatial index.

# Install

```sh
npm install quadbin
```

# Usage

```javascript
import {hexToBigInt, getResolution} from 'quadbin';

getResolution(hexToBigInt('4830ffffffffffff'));
// Returns: 3
```


_Note: we still need to create the npm module_

# I/O types

A Quadbin index is a 64-bit integer. This library uses [BigInt](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) as a data type to represent quadbin indices, both as parameters and return values for functions.

When working with quadbin indices in other contexts (e.g. passing as a parameter in a URL or serializing as JSON), it is more appropriate to encode the index as a hexidecimal string. The library provides the `bigIntToHex()` & `hexToBigInt()` to facilitate this conversion.

# API

_Note: we are attempting to follow the API of h3-js to make this library a drop-in replacement for H3. H3-js is close to releasing a new version (4) [which changes the API](https://h3geo.org/docs/next/library/migration-3.x/functions/). This repo will follow the new conventions set in H3-JS v4_

## bigIntToHex

```typescript
function bigIntToHex(index: bigint): string
```

Encodes an index into a string, suitable for use in JSON.

## hexToBigInt(hex: string): bigint

Decodes an string into an index. Inverse of `bigIntToHex()`

## tileToCell(tile: {x: number, y: number, z: number}): bigint
