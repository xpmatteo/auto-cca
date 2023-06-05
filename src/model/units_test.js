
import { assertEquals, assertTrue, assertFalse, test } from '../test_lib.js';
import { Side } from './side.js';
import { RomanHeavyInfantry } from './units.js';


test('units', function () {
    let unit0 = new RomanHeavyInfantry();

    assertEquals('rom_inf_hv.png', unit0.imageName);
    assertEquals(Side.ROMAN, unit0.side);
});


