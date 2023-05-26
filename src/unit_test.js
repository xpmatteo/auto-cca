
import { assertEquals, assertTrue, assertFalse, test } from './test_lib.js';
import { Game, Side, RomanHeavyInfantry } from './game.js';
import { Hex } from './hexlib.js';

test('units', function () {
    let unit0 = new RomanHeavyInfantry();

    assertEquals('rom_inf_hv.png', unit0.imageName);
    assertEquals(Side.ROMAN, unit0.allegiance);
});


test('click and select unit', function () {
    let game = new Game();
    game.addUnit(new Hex(0, 0), new RomanHeavyInfantry());

    game.click(new Hex(0, 0));

    assertTrue(game.units[0].isSelected);
});

