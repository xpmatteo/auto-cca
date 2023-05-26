
import { assertEquals, assertTrue, assertFalse, test } from './test_lib.js';
import { Game, RomanHeavyInfantry } from './game.js';
import { Hex } from './hexlib.js';

test('add units', function () {
    let game = new Game();
    let unit0 = new RomanHeavyInfantry();
    let unit1 = new RomanHeavyInfantry();

    game.addUnit(unit0);
    game.addUnit(unit1);

    assertEquals(2, game.units.length);
    assertEquals(unit0, game.units[0]);
    assertEquals(unit1, game.units[1]);
});


test('click and select unit', function () {
    let game = new Game();
    game.addUnit(new Hex(0, 0), new RomanHeavyInfantry());
    assertFalse(game.units[0].isSelected, "should not be selected at start");

    game.click(new Hex(0, 0));

    assertTrue(game.units[0].isSelected, "should be selected");
});

test('click and deselect unit', function () {
    let game = new Game();
    game.addUnit(new Hex(0, 0), new RomanHeavyInfantry());

    game.click(new Hex(0, 0));
    game.click(new Hex(0, 0));

    assertFalse(game.units[0].isSelected, "should not be selected");
});

