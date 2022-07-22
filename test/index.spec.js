import test from 'tape';
import {tileToQuadbin, quadbinToTile, quadbinParent, quadbinZoom} from '../src/index'
import {tileToQuadkey} from './quadkey-utils';

const TEST_TILES = [
  {x: 0, y: 0, z: 0, q: '480fffffffffffff'},
  {x: 1, y: 2, z: 3, q: '48327fffffffffff'},
  {x: 1023, y: 2412, z: 23, q: '4970000021df7d7f'}
];

test('Quadbin conversion', async t => {
  for (const {x, y, z, q} of TEST_TILES) {
    const tile = {x, y, z};
    const quadbin = tileToQuadbin(tile);
    t.deepEqual(quadbin, q, 'quadbins match');

    const tile2 = quadbinToTile(quadbin);
    t.deepEqual(tile, tile2, 'tiles match');
  }

  t.end();
});

test('Quadbin getParent', async t => {
  let tile = {x: 134, y: 1238, z: 10};
  const quadkey = tileToQuadkey(tile);

  while (tile.z > 0) {
    const quadbin = tileToQuadbin(tile);
    const parent = quadbinParent(quadbin);
    const zoom = quadbinZoom(parent);
    tile = quadbinToTile(parent);
    const quadkey2 = tileToQuadkey(tile);

    t.deepEquals(quadkey2, quadkey.slice(0, tile.z), `parent correct ${quadkey2}`);
    t.deepEquals(Number(zoom), tile.z, `zoom correct ${zoom}`);
  }

  t.end();
});
