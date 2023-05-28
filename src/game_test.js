
import { assertEquals, assertTrue, assertFalse, test, xtest, fail } from './test_lib.js';
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

test('add unit outside map', () => {
    let game = new Game();
    let unit = new RomanHeavyInfantry();

    try {
        game.addUnit(new Hex(1000, 0), unit);
        fail("should have thrown exception");
    } catch (err) {
        assertEquals('Error: Hex [1000,0] outside of map', err.toString());
    }
});

test('stacking not allowed', () => {
    let game = new Game();
    let unit0 = new RomanHeavyInfantry();
    let unit1 = new RomanHeavyInfantry();
    game.addUnit(new Hex(0, 0), unit0);

    try {
        game.addUnit(new Hex(0, 0), unit1);
        fail("should have thrown exception");
    } catch (err) {
        assertEquals('Error: Unit already exists at [0,0]', err.toString());
    }
});

test('adding same unit in two places?', () => {
    let game = new Game();
    let unit = new RomanHeavyInfantry();
    game.addUnit(new Hex(0, 0), unit);

    try {
        game.addUnit(new Hex(0, 1), unit);
        fail("should have thrown exception");
    } catch (err) {
        assertEquals('Error: Unit added twice', err.toString());
    }
});


test('map', function () {
    let game = new Game();
    let count = 0;

    game.foreachHex((hex) => {
        count++;
    });

    assertEquals(5 * 13 + 4 * 12, count);
});

test('click and select unit', function () {
    let game = new Game();
    let unit = new RomanHeavyInfantry();
    game.addUnit(new Hex(0, 0), unit);
    assertFalse(unit.isSelected, "should not be selected at start");

    game.click(new Hex(0, 0));

    assertTrue(unit.isSelected, "should be selected");
});

test('click and deselect unit', function () {
    let game = new Game();
    let unit = new RomanHeavyInfantry();
    game.addUnit(new Hex(0, 0), unit);

    game.click(new Hex(0, 0));
    game.click(new Hex(0, 0));

    assertFalse(unit.isSelected, "should not be selected");
});

// test('', () => {});

test('click nowhere and deselect', () => {
    let game = new Game();
    let unit = new RomanHeavyInfantry();
    game.addUnit(new Hex(0, 0), unit);

    game.click(new Hex(0, 0));
    assertTrue(unit.isSelected, "should be selected");
    
    game.click(new Hex(100, 0));
    assertFalse(unit.isSelected, "should not be selected");
});

/*
     1,4   2,4    3,4
        1,5   2,5    3,5
     0,6   1,6    2,6    3,6   
*/

test('click and move one unit', () => {
    let game = new Game();
    let unit = new RomanHeavyInfantry();
    game.addUnit(new Hex(1,5), unit);
    game.click(new Hex(1, 5));
    assertTrue(unit.isSelected, "should be selected");
    
    game.click(new Hex(2, 5));
    assertFalse(unit.isSelected, "should not be selected");
    assertEquals(unit, game.unitAt(new Hex(2, 5)));
});

