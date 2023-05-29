
import { assertEquals, assertTrue, assertFalse, assertDeepEquals, assertEqualsInAnyOrder, test, xtest, fail } from './test_lib.js';
import { Hex } from './hexlib.js';
import { Game, RomanHeavyInfantry } from './game.js';
import { InteractiveGame } from "./interactive_game.js";

function otherUnit() {
    return new RomanHeavyInfantry();
}

function makeGame() {
    return new InteractiveGame(new Game());
}

test('click and select unit', function () {
    let game = makeGame();
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
    let game = makeGame();
    let unit0 = new RomanHeavyInfantry();
    let unit1 = new RomanHeavyInfantry();
    game.addUnit(new Hex(0, 0), unit0);
    game.addUnit(new Hex(0, 1), unit1);

    game.click(new Hex(0, 0));
    game.click(new Hex(0, 1));

    assertEquals(unit1, game.selectedUnit(), "new unit should be selected");
});

test('click and deselect unit', function () {
    let game = makeGame();
    let unit = new RomanHeavyInfantry();
    game.addUnit(new Hex(0, 0), unit);

    game.click(new Hex(0, 0));
    game.click(new Hex(0, 0));

    assertEquals(undefined, game.selectedUnit(), "should not be selected");
    assertEqualsInAnyOrder([], game.hilightedHexes, "no hilighted hexes");
});


// test('', () => {});

test('click nowhere and deselect', () => {
    let game = makeGame();
    let unit = new RomanHeavyInfantry();
    game.addUnit(new Hex(0, 0), unit);

    game.click(new Hex(0, 0));
    assertEquals(unit, game.selectedUnit(), "unit should be selected");
    
    game.click(new Hex(100, 0));
    assertEquals(undefined, game.selectedUnit(), "should not be selected");
});

test('click outside map does not move off-board', () => {
    let game = makeGame();
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
    let game = makeGame();
    let unit = new RomanHeavyInfantry();
    game.addUnit(new Hex(1,5), unit);
    game.click(new Hex(1, 5)); 
    
    game.click(new Hex(2, 5));
    assertEquals(undefined, game.selectedUnit(), "should not be selected");
    assertEquals(unit, game.unitAt(new Hex(2, 5)));
});

