
import { assertEquals, assertTrue, assertFalse, assertDeepEquals, assertEqualsInAnyOrder, test, xtest, fail } from './test_lib.js';
import { Game, RomanHeavyInfantry } from './game.js';
import { Hex } from './hexlib.js';

function otherUnit() {
    return new RomanHeavyInfantry();
}

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
    game.addUnit(new Hex(1, 1), unit);
    game.addUnit(new Hex(2, 1), otherUnit());
    assertFalse(unit.isSelected, "should not be selected at start");
    assertEquals(undefined, game.selectedUnit(), "no selected unit at start");
    assertEqualsInAnyOrder([], game.hilightedHexes, "no hilighted hexes at start");

    game.click(new Hex(1, 1));

    assertEquals(unit, game.selectedUnit(), "selected unit");
    assertDeepEquals(new Hex(1, 1), game.selectedHex());
    let expectedHilightedHexes = [new Hex(0,1), new Hex(1,0), new Hex(0,2), new Hex(1,2), new Hex(2, 0)];
    assertEqualsInAnyOrder(expectedHilightedHexes, game.hilightedHexes);
});

test('click on other unit', function () {
    let game = new Game();
    let unit0 = new RomanHeavyInfantry();
    let unit1 = new RomanHeavyInfantry();
    game.addUnit(new Hex(0, 0), unit0);
    game.addUnit(new Hex(0, 1), unit1);

    game.click(new Hex(0, 0));
    game.click(new Hex(0, 1));

    assertEquals(unit1, game.selectedUnit(), "new unit should be selected");
});

test('click and deselect unit', function () {
    let game = new Game();
    let unit = new RomanHeavyInfantry();
    game.addUnit(new Hex(0, 0), unit);

    game.click(new Hex(0, 0));
    game.click(new Hex(0, 0));

    assertEquals(undefined, game.selectedUnit(), "should not be selected");
    assertEqualsInAnyOrder([], game.hilightedHexes, "no hilighted hexes");
});


// test('', () => {});

test('click nowhere and deselect', () => {
    let game = new Game();
    let unit = new RomanHeavyInfantry();
    game.addUnit(new Hex(0, 0), unit);

    game.click(new Hex(0, 0));
    assertEquals(unit, game.selectedUnit(), "unit should be selected");
    
    game.click(new Hex(100, 0));
    assertEquals(undefined, game.selectedUnit(), "should not be selected");
});

test('click outside map does not move off-board', () => {
    let game = new Game();
    let unit = new RomanHeavyInfantry();
    game.addUnit(new Hex(0, 0), unit);

    game.click(new Hex(0, 0));
    assertEquals(unit, game.selectedUnit(), "unit should be selected");
    
    game.click(new Hex(0, -1));
    assertEquals(undefined, game.selectedUnit(), "should not be selected");
    assertEquals(unit, game.unitAt(new Hex(0, 0)));
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
    
    game.click(new Hex(2, 5));
    assertEquals(undefined, game.selectedUnit(), "should not be selected");
    assertEquals(unit, game.unitAt(new Hex(2, 5)));
});

