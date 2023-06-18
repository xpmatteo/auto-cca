
import { assertEquals, assertTrue, assertFalse, assertDeepEquals, assertEqualsInAnyOrder, test, xtest, fail } from './lib/test_lib.js';
import { hexOf } from './lib/hexlib.js';
import makeGame from './model/game.js';
import { NullScenario } from './model/scenarios.js';
import { InteractiveGame } from "./interactive_game.js";
import { CarthaginianHeavyInfantry, RomanHeavyInfantry } from './model/units.js';
import { CloseCombatCommand, EndPhaseCommand } from './model/commands/commands.js';
import {MoveCommand} from "./model/commands/moveCommand.js";

function otherUnit() {
    return new RomanHeavyInfantry();
}

function enemyUnit() {
    return new CarthaginianHeavyInfantry();
}

function makeInteractiveGame() {
    return new InteractiveGame(makeGame(new NullScenario()));
}

function makeGameInBattlePhase() {
    let game = makeInteractiveGame();
    game.endPhase();
    return game;
}

test('click and select unit', function () {
    let game = makeInteractiveGame();
    let unit = new RomanHeavyInfantry();
    game.placeUnit(hexOf(1, 1), unit);
    game.placeUnit(hexOf(2, 1), otherUnit());
    assertFalse(unit.isSelected, "should not be selected at start");
    assertEquals(undefined, game.selectedUnit(), "no selected unit at start");

    game.onClick(hexOf(1, 1));

    assertEquals(unit, game.selectedUnit(), "selected unit");
    assertDeepEquals(hexOf(1, 1), game.selectedHex());
});

test('cannot select a spent unit', function () {
    let game = makeInteractiveGame();
    let unit = new RomanHeavyInfantry();
    game.placeUnit(hexOf(1, 1), unit);

    game.onClick(hexOf(1, 1));
    game.onClick(hexOf(1, 2));

    assertEquals(unit, game.unitAt(hexOf(1, 2)), "unit has moved");
    assertEquals(undefined, game.selectedUnit(), "should not be selected");
    assertTrue(game.isSpent(unit), "unit should be spent");

    game.onClick(hexOf(1, 2));
    assertEquals(undefined, game.selectedUnit(), "should not be able to select a spent unit");
});

test('click and deselect unit', function () {
    let game = makeInteractiveGame();
    let unit = new RomanHeavyInfantry();
    game.placeUnit(hexOf(0, 0), unit);

    game.onClick(hexOf(0, 0));
    game.onClick(hexOf(0, 0));

    assertEquals(undefined, game.selectedUnit(), "should not be selected");
});

test('click nowhere and deselect', () => {
    let game = makeInteractiveGame();
    let unit = new RomanHeavyInfantry();
    game.placeUnit(hexOf(0, 0), unit);

    game.onClick(hexOf(0, 0));
    assertEquals(unit, game.selectedUnit(), "unit should be selected");
    
    game.onClick(hexOf(100, 0));
    assertEquals(undefined, game.selectedUnit(), "should not be selected");
});

test('click outside map does not move off-board', () => {
    let game = makeInteractiveGame();
    let unit = new RomanHeavyInfantry();
    game.placeUnit(hexOf(0, 0), unit);

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
    let game = makeInteractiveGame();
    let unit = new RomanHeavyInfantry();
    game.placeUnit(hexOf(1,5), unit);
    game.onClick(hexOf(1, 5)); 
    
    game.onClick(hexOf(2, 5));
    assertEquals(undefined, game.selectedUnit(), "should not be selected");
    assertEquals(unit, game.unitAt(hexOf(2, 5)));
});

// =========== battle tests =========== 

test('click and select unit in battle phase', function () {
    let game = makeGameInBattlePhase();
    let unit = new RomanHeavyInfantry();
    game.placeUnit(hexOf(1, 1), unit);
    game.placeUnit(hexOf(2, 1), enemyUnit());
    assertFalse(unit.isSelected, "should not be selected at start");
    assertEquals(undefined, game.selectedUnit(), "no selected unit at start");

    game.onClick(hexOf(1, 1));

    assertEquals(unit, game.selectedUnit(), "selected unit");
    assertDeepEquals(hexOf(1, 1), game.selectedHex());
});

test('click and deselect unit in battle phase', function () {
    let game = makeGameInBattlePhase();
    let unit = new RomanHeavyInfantry();
    game.placeUnit(hexOf(0, 0), unit);
    game.placeUnit(hexOf(0, 1), enemyUnit());

    game.onClick(hexOf(0, 0));
    game.onClick(hexOf(0, 0));

    assertEquals(undefined, game.selectedUnit(), "should not be selected");
});

test('click nowhere and deselect in battle phase', () => {
    let game = makeGameInBattlePhase();
    let unit = new RomanHeavyInfantry();
    game.placeUnit(hexOf(0, 0), unit);
    game.placeUnit(hexOf(0, 1), enemyUnit());

    game.onClick(hexOf(0, 0));
    assertEquals(unit, game.selectedUnit(), "unit should be selected");
    
    game.onClick(hexOf(100, 0));
    assertEquals(undefined, game.selectedUnit(), "should not be selected");
});

test('click on enemy unit and deselect in battle phase', () => {
    let game = makeGameInBattlePhase();
    let unit = new RomanHeavyInfantry();
    game.placeUnit(hexOf(0, 0), unit);
    game.placeUnit(hexOf(0, 1), enemyUnit());

    game.onClick(hexOf(0, 0));
    assertEquals(unit, game.selectedUnit(), "unit should be selected");
    
    game.onClick(hexOf(0, 0));
    assertFalse(game.selectedUnit(), "should not be selected");
});


test('click and close combat one unit', () => {
    let commandsExecuted = [];
    let game = makeGameInBattlePhase();
    let unit = new RomanHeavyInfantry();
    game.placeUnit(hexOf(0, 0), unit);
    game.placeUnit(hexOf(0, 1), enemyUnit());
    game.executeCommand = function(command) {
        commandsExecuted.push(command);
    };

    game.onClick(hexOf(0, 0));
    game.onClick(hexOf(0, 1));

    assertEquals(undefined, game.selectedUnit(), "should not be selected");
    assertDeepEquals([new CloseCombatCommand(hexOf(0, 1), hexOf(0, 0))], commandsExecuted);
});

test('hilighted hexes when no unit is selected', () => {
    const fakeGame = {
        validCommands: function() {
            return [
                new MoveCommand(hexOf(0, 2), hexOf(0, 1)),
                new MoveCommand(hexOf(0, 3), hexOf(0, 2)),
                new MoveCommand(hexOf(0, 4), hexOf(0, 3)),
                new EndPhaseCommand(),
            ];
        },
    };
    const interactiveGame = new InteractiveGame(fakeGame);

    assertDeepEquals(new Set([hexOf(0, 1), hexOf(0, 2), hexOf(0, 3)]), interactiveGame.hilightedHexes);
});

test('hilighted hexes when a unit is selected', () => {
    const fakeGame = {
        validCommands: function() {
            return [
                new MoveCommand(hexOf(0, 2), hexOf(0, 0)),
                new MoveCommand(hexOf(0, 3), hexOf(0, 0)),
                new MoveCommand(hexOf(0, 4), hexOf(0, 3)),
                new EndPhaseCommand(),
            ];
        },

        hexOfUnit: function() {
            return hexOf(0, 0);
        },
    };
    const interactiveGame = new InteractiveGame(fakeGame);
    interactiveGame.__selectUnit(hexOf(0, 0));

    assertDeepEquals(new Set([hexOf(0, 2), hexOf(0, 3)]), interactiveGame.hilightedHexes);
});
