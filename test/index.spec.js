import test from 'tape';
import {tileToCell, cellToTile, cellToParent, geometryToCells, getResolution} from '../src/index';
import {tileToQuadkey} from './quadkey-utils';

const TEST_TILES = [
  {x: 0, y: 0, z: 0, q: 5192650370358181887n},
  {x: 1, y: 2, z: 3, q: 5202361257054699519n},
  {x: 1023, y: 2412, z: 23, q: 5291729562728627583n}
];

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

const GEOMETRY = {type: 'Point', coordinates: [-3.71219873428345, 40.413365349070865]};
test('Quadbin geometryToCells', async t => {
  const cells = geometryToCells(GEOMETRY, 0);
  t.deepEquals(cells, [5192650370358181887n], 'Correct cells generated from geometry');
  t.end();
});
