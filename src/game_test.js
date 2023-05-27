
import { assertEquals, assertTrue, assertFalse, test, xtest } from './test_lib.js';
import { Game, RomanHeavyInfantry } from './game.js';
import { Hex } from './hexlib.js';

test('add units', function () {
    let game = new Game();
    let unit0 = new RomanHeavyInfantry();
    let unit1 = new RomanHeavyInfantry();

    game.addUnit(new Hex(0, 0), unit0);
    game.addUnit(new Hex(0, 1), unit1);

    let count = 0;
    game.foreachUnit((unit, hex) => { count++; });
    assertEquals(2, count);
    assertEquals(unit0, game.unitAt(new Hex(0, 0)));
    assertEquals(unit1, game.unitAt(new Hex(0, 1)));
});


xtest('click and select unit', function () {
    let game = new Game();
    game.addUnit(new Hex(0, 0), new RomanHeavyInfantry());
    assertFalse(game.units[0].isSelected, "should not be selected at start");

    game.click(new Hex(0, 0));

    assertTrue(game.units[0].isSelected, "should be selected");
});

xtest('click and deselect unit', function () {
    let game = new Game();
    game.addUnit(new Hex(0, 0), new RomanHeavyInfantry());

    game.click(new Hex(0, 0));
    game.click(new Hex(0, 0));

    assertFalse(game.units[0].isSelected, "should not be selected");
});

