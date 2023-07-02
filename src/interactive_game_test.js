import { assertDeepEquals, assertEquals, assertFalse, assertTrue, test } from './lib/test_lib.js';
import { hexOf } from './lib/hexlib.js';
import makeGame from './model/game.js';
import { NullScenario } from './model/scenarios.js';
import { InteractiveGame } from "./interactive_game.js";
import { RomanHeavyInfantry } from './model/units.js';
import { MovementPhase } from "./model/phases/MovementPhase.js";

function otherUnit() {
    return new RomanHeavyInfantry();
}

function makeGameInMovementPhase() {
    const game = makeGame(new NullScenario());
    const interactiveGame = new InteractiveGame(game);
    game.phases = [new MovementPhase()];
    return interactiveGame;
}

test('click and select unit', function () {
    let game = makeGameInMovementPhase();
    let unit = new RomanHeavyInfantry();
    game.placeUnit(hexOf(1, 1), unit);
    game.orderUnit(hexOf(1, 1));
    game.placeUnit(hexOf(2, 1), otherUnit());
    assertEquals(undefined, game.selectedUnit(), "no selected unit at start");

    game.onClick(hexOf(1, 1));

    assertEquals(unit, game.selectedUnit(), "selected unit");
    assertDeepEquals(hexOf(1, 1), game.selectedHex());
});

test('cannot select a spent unit', function () {
    let game = makeGameInMovementPhase();
    let unit = new RomanHeavyInfantry();
    game.placeUnit(hexOf(1, 1), unit);
    game.orderUnit(hexOf(1, 1));

    game.onClick(hexOf(1, 1));
    game.onClick(hexOf(1, 2));

    assertEquals(unit, game.unitAt(hexOf(1, 2)), "unit has moved");
    assertEquals(undefined, game.selectedUnit(), "should not be selected");
    assertTrue(game.isSpent(unit), "unit should be spent");

    game.onClick(hexOf(1, 2));
    assertEquals(undefined, game.selectedUnit(), "should not be able to select a spent unit");
});

test('click and deselect unit', function () {
    let game = makeGameInMovementPhase();
    let unit = new RomanHeavyInfantry();
    game.placeUnit(hexOf(0, 0), unit);

    game.onClick(hexOf(0, 0));
    game.onClick(hexOf(0, 0));

    assertEquals(undefined, game.selectedUnit(), "should not be selected");
});

test('click nowhere and deselect', () => {
    let game = makeGameInMovementPhase();
    let unit = new RomanHeavyInfantry();
    game.placeUnit(hexOf(0, 0), unit);
    game.orderUnit(hexOf(0, 0));

    game.onClick(hexOf(0, 0));
    assertEquals(unit, game.selectedUnit(), "unit should be selected");
    
    game.onClick(hexOf(100, 0));
    assertEquals(undefined, game.selectedUnit(), "should not be selected");
});

test('click outside map does not move off-board', () => {
    let game = makeGameInMovementPhase();
    let unit = new RomanHeavyInfantry();
    game.placeUnit(hexOf(0, 0), unit);
    game.orderUnit(hexOf(0, 0));

    game.onClick(hexOf(0, 0));
    assertEquals(unit, game.selectedUnit(), "unit should be selected");
    
    game.onClick(hexOf(0, -1));
    assertEquals(undefined, game.selectedUnit(), "should not be selected");
    assertEquals(unit, game.unitAt(hexOf(0, 0)));
});

/*
     1,4   2,4    3,4
        1,5   2,5    3,5
     0,6   1,6    2,6    3,6   
*/

test('click and move one unit', () => {
    let game = makeGameInMovementPhase();
    let unit = new RomanHeavyInfantry();
    game.placeUnit(hexOf(1, 5), unit);
    game.orderUnit(hexOf(1, 5));
    game.onClick(hexOf(1, 5)); 
    
    game.onClick(hexOf(2, 5));
    assertEquals(undefined, game.selectedUnit(), "should not be selected");
    assertEquals(unit, game.unitAt(hexOf(2, 5)));
});

test('hilighted hexes when no unit is selected', () => {
    const fakeGame = makeGame(new NullScenario());
    const interactiveGame = new InteractiveGame(fakeGame);
    fakeGame.placeUnit(hexOf(0, 0), new RomanHeavyInfantry());
    fakeGame.placeUnit(hexOf(0, 1), new RomanHeavyInfantry());

    assertDeepEquals(new Set([hexOf(0, 1), hexOf(0, 0)]), interactiveGame.hilightedHexes);
});

test('hilighted hexes when a unit is selected', () => {
    const fakeGame = makeGame(new NullScenario());
    const interactiveGame = new InteractiveGame(fakeGame);
    fakeGame.placeUnit(hexOf(0, 0), new RomanHeavyInfantry());
    fakeGame.placeUnit(hexOf(0, 1), new RomanHeavyInfantry());
    interactiveGame.onClick(hexOf(0, 0));

    assertDeepEquals(new Set([hexOf(1, 0), hexOf(0, 1)]), interactiveGame.hilightedHexes);
});
