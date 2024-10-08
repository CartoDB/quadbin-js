import test from 'tape';
import {
  tileToCell,
  cellToTile,
  cellToParent,
  geometryToCells,
  getResolution,
  cellToBoundary
} from 'quadbin';

import {tileToQuadkey} from './quadkey-utils.js';

const TEST_TILES = [
  {x: 0, y: 0, z: 0, q: 5192650370358181887n},
  {x: 1, y: 2, z: 3, q: 5202361257054699519n},
  {x: 1023, y: 2412, z: 23, q: 5291729562728627583n}
];

const ANY_QUADBIN = BigInt(524800);

test('Quadbin conversion', async t => {
  for (const {x, y, z, q} of TEST_TILES) {
    const tile = {x, y, z};
    const quadbin = tileToCell(tile);
    t.deepEqual(quadbin, q, 'quadbins match');

    const tile2 = cellToTile(quadbin);
    t.deepEqual(tile, tile2, 'tiles match');
  }

  t.end();
});

test('Quadbin getParent', async t => {
  let tile = {x: 134, y: 1238, z: 10};
  const quadkey = tileToQuadkey(tile);

  while (tile.z > 0) {
    const quadbin = tileToCell(tile);
    const parent = cellToParent(quadbin);
    const zoom = getResolution(parent);
    tile = cellToTile(parent);
    const quadkey2 = tileToQuadkey(tile);

    t.deepEquals(quadkey2, quadkey.slice(0, tile.z), `parent correct ${quadkey2}`);
    t.deepEquals(Number(zoom), tile.z, `zoom correct ${zoom}`);
  }

  t.end();
});

// Zoom:26 test not agreeing with Python
import PointGeometry from './data/PointGeometry.json' assert {type: 'json'};
import MultiPointGeometry from './data/MultiPointGeometry.json' assert {type: 'json'};
import LineStringGeometry from './data/LineStringGeometry.json' assert {type: 'json'};
import PolygonGeometry from './data/PolygonGeometry.json' assert {type: 'json'};
import PolygonAntimeridianGeometry from './data/PolygonAntimeridianGeometry.json' assert {type: 'json'};
import MultiPolygonGeometry from './data/MultiPolygonGeometry.json' assert {type: 'json'};
const testCases = [
  PointGeometry,
  MultiPointGeometry,
  LineStringGeometry,
  PolygonGeometry,
  PolygonAntimeridianGeometry,
  MultiPolygonGeometry
];

test('Quadbin geometryToCells', async t => {
  for (const {name, geometry, expected} of testCases) {
    for (const resolution of Object.keys(expected)) {
      const expectedCells = expected[resolution].map(BigInt).sort();
      const cells = geometryToCells(geometry, resolution).sort();
      t.deepEquals(
        cells,
        expectedCells,
        `Correct cells generated from ${name} geometry at resolution ${resolution}`
      );
    }
  }
  t.end();
});

test('Quadbin cellToBoundary', t => {
  for (const {quadbin, expectedPolygon} of [
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
  ]) {
    const result = cellToBoundary(quadbin);
    t.deepEquals(result, expectedPolygon);
  }

  t.end();
});
