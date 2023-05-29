
import { assertEquals, assertTrue, assertFalse, test } from './test_lib.js';
import { Side, RomanHeavyInfantry } from './game.js';
import { Hex } from './hexlib.js';

test('units', function () {
    let unit0 = new RomanHeavyInfantry();

    assertEquals('rom_inf_hv.png', unit0.imageName);
    assertEquals(Side.ROMAN, unit0.side);
});


