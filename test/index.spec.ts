import {describe, expect, test} from 'vitest';
import {
  cellToBoundary,
  tileToCell,
  cellToChildren,
  cellToTile,
  cellToParent,
  geometryToCells,
  getResolution
} from 'quadbin';

import {tileToQuadkey} from './quadkey-utils.js';

import PointGeometry from './data/PointGeometry.json' with {type: 'json'};
import MultiPointGeometry from './data/MultiPointGeometry.json' with {type: 'json'};
import LineStringGeometry from './data/LineStringGeometry.json' with {type: 'json'};
import PolygonGeometry from './data/PolygonGeometry.json' with {type: 'json'};
import PolygonAntimeridianGeometry from './data/PolygonAntimeridianGeometry.json' with {type: 'json'};
import MultiPolygonGeometry from './data/MultiPolygonGeometry.json' with {type: 'json'};

const TEST_GEOMETRIES = [
  PointGeometry,
  MultiPointGeometry,
  LineStringGeometry,
  PolygonGeometry,
  PolygonAntimeridianGeometry,
  MultiPolygonGeometry
];

const TEST_TILES = [
  {x: 0, y: 0, z: 0, q: 5192650370358181887n},
  {x: 1, y: 2, z: 3, q: 5202361257054699519n},
  {x: 1023, y: 2412, z: 23, q: 5291729562728627583n}
];

describe('tileToCell', () => {
  test.each(TEST_TILES)('%s', ({x, y, z, q}) => {
    expect(tileToCell({x, y, z})).toEqual(q);
  });
});

describe('cellToTile', () => {
  test.each(TEST_TILES)('%s', ({x, y, z, q}) => {
    const tile = {x, y, z};
    expect(cellToTile(tileToCell(tile))).toEqual(tile);
  });
});

test('cellToParent', () => {
  let tile = {x: 134, y: 1238, z: 10};
  const quadkey = tileToQuadkey(tile);

  while (tile.z > 0) {
    const quadbin = tileToCell(tile);
    const parent = cellToParent(quadbin);
    const zoom = getResolution(parent);
    tile = cellToTile(parent);
    const quadkey2 = tileToQuadkey(tile);

    expect(quadkey2).toEqual(quadkey.slice(0, tile.z));
    expect(Number(zoom)).toEqual(tile.z);
  }
});

test('cellToChildren', t => {
  const parentTile = {z: 8, x: 59, y: 97};
  const parent = tileToCell(parentTile);

  expect(cellToChildren(parent, 8n)).toEqual([parent]);

  // Order is row major, starting from NW and ending at SE.
  expect(cellToChildren(parent, 9n).map(cellToTile)).toEqual([
    {z: 9, x: 118, y: 194}, // nw
    {z: 9, x: 119, y: 194}, // ne
    {z: 9, x: 118, y: 195}, // sw
    {z: 9, x: 119, y: 195} // se
  ]);

  expect(cellToChildren(parent, 10n).length).toBe(16);
});

describe('geometryToCells', () => {
  // NOTE: zoom=26 test does not agree with Python.
  test.each(TEST_GEOMETRIES)('$name', ({name, geometry, expected}) => {
    for (const resolution of Object.keys(expected)) {
      const expectedCells = expected[resolution].map(BigInt).sort();
      const cells = geometryToCells(geometry, BigInt(resolution)).sort();
      expect(cells).toEqual(expectedCells);
    }
  });
});

describe('cellToBoundary', () => {
  const TEST_CASES = [
    {
      quadbin: BigInt(524800),
      expectedPolygon: {
        type: 'Polygon',
        coordinates: [
          [
            [180, 85.0511287798066],
            [180, -85.05112877980659],
            [-180, -85.05112877980659],
            [-180, 85.0511287798066],
            [180, 85.0511287798066]
          ]
        ]
      }
    },
    {
      quadbin: BigInt(536903670), // Longitude near +180°
      expectedPolygon: {
        type: 'Polygon',
        coordinates: [
          [
            [180, 85.0511287798066],
            [180, -85.05112877980659],
            [-180, -85.05112877980659],
            [-180, 85.0511287798066],
            [180, 85.0511287798066]
          ]
        ]
      }
    },
    {
      quadbin: BigInt(536870921), // Longitude near -180°
      expectedPolygon: {
        type: 'Polygon',
        coordinates: [
          [
            [180, 85.0511287798066],
            [180, -85.05112877980659],
            [-180, -85.05112877980659],
            [-180, 85.0511287798066],
            [180, 85.0511287798066]
          ]
        ]
      }
    }
  ];

  test.each(TEST_CASES)('$quadbin', ({quadbin, expectedPolygon}) => {
    expect(cellToBoundary(quadbin)).toEqual(expectedPolygon);
  });
});
