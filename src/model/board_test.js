import { assertEquals, fail, test } from '../lib/test_lib.js';
import { hexOf } from '../lib/hexlib.js';
import { Board } from './board.js';
import { RomanHeavyInfantry } from './units.js';

function makeBoard() {
    return new Board();
}

test('add units', function () {
    let game = makeBoard();
    let unit0 = new RomanHeavyInfantry();
    let unit1 = new RomanHeavyInfantry();

    game.placeUnit(hexOf(0, 0), unit0);
    game.placeUnit(hexOf(0, 1), unit1);

    let count = 0;
    game.foreachUnit((unit, hex) => { count++; });
    assertEquals(2, count);
    assertEquals(unit0, game.unitAt(hexOf(0, 0)));
    assertEquals(unit1, game.unitAt(hexOf(0, 1)));
});

test('add unit outside map', () => {
    let game = makeBoard();
    let unit = new RomanHeavyInfantry();

    try {
        game.placeUnit(hexOf(100, 0), unit);
        fail("should have thrown exception");
    } catch (err) {
        assertEquals('Error: Hex [100,0] outside of map', err.toString());
    }
});

test('stacking not allowed', () => {
    let game = makeBoard();
    let unit0 = new RomanHeavyInfantry();
    let unit1 = new RomanHeavyInfantry();
    game.placeUnit(hexOf(0, 0), unit0);

    try {
        game.placeUnit(hexOf(0, 0), unit1);
        fail("should have thrown exception");
    } catch (err) {
        assertEquals('Error: Unit already exists at [0,0]', err.toString());
    }
});

test('adding same unit in two places?', () => {
    let game = makeBoard();
    let unit = new RomanHeavyInfantry();
    game.placeUnit(hexOf(0, 0), unit);

    try {
        game.placeUnit(hexOf(0, 1), unit);
        fail("should have thrown exception");
    } catch (err) {
        assertEquals('Error: Unit added twice', err.toString());
    }
});

test('map size', function () {
    let game = makeBoard();
    let count = 0;

    game.foreachHex((hex) => {
        count++;
    });

    assertEquals(5 * 13 + 4 * 12, count);
});

test('clone board', function () {
    let original = makeBoard();
    let unit0 = new RomanHeavyInfantry();
    original.placeUnit(hexOf(0, 0), unit0);

    let clone = original.clone();
    clone.moveUnit(hexOf(0, 1), hexOf(0, 0));

    assertEquals(unit0, original.unitAt(hexOf(0, 0)));
    assertEquals(unit0, clone.unitAt(hexOf(0, 1)));
});
