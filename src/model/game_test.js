import { hexOf } from "../lib/hexlib.js";
import { assertEquals, assertFalse, assertTrue, assertDeepEquals, test, xtest } from "../lib/test_lib.js";
import makeGame from "./game.js";
import * as GameStatus from "./game_status.js";
import * as units from "./units.js";
import { Side } from "./side.js";
import { MoveCommand, EndPhaseCommand } from "./commands/commands.js";
import { Scenario, TestScenario } from "./scenarios.js";

class SimpleScenario extends Scenario {
    get firstSide() {
        return Side.CARTHAGINIAN;
    }

    placeUnitsOn(board) {
        board.placeUnit(hexOf(1, 5), new units.RomanHeavyInfantry());
    }

    gameStatus(board) {
        let status;
        board.foreachUnit((unit, hex) => {
            if (hex === hexOf(0, 5)) {
                status = GameStatus.ROMAN_WIN;
            }
        });
        return status || GameStatus.ONGOING;
    }
}

const scenario = new SimpleScenario();

test("game status", () => {
    const game = makeGame(scenario);

    assertEquals(GameStatus.ONGOING, game.gameStatus);
    assertFalse(game.isTerminal(), "game is not terminal?!?")
});

test("validCommands", () => {
    const game = makeGame(scenario);

    let validCommands = game.validCommands();

    // the only unit on board is Roman, first player is Carthaginian
    assertDeepEquals([new EndPhaseCommand()], validCommands);
});

test("executeCommand - game over", () => {
    const game = makeGame(scenario);
    
    game.executeCommand(new EndPhaseCommand());
    game.executeCommand(new MoveCommand(hexOf(0, 5), hexOf(1, 5)));

    assertEquals(GameStatus.ROMAN_WIN, game.gameStatus);
    assertTrue(game.isTerminal(), "game is not terminal?!?");
    assertEquals(0, game.validCommands().length);
});

test("currentSide", () => {
    const cca = makeGame(scenario);
    
    assertEquals(Side.CARTHAGINIAN, cca.currentSide);
});

test("opposingSide", () => {
    const game = makeGame(scenario);
    
    assertEquals(Side.CARTHAGINIAN, game.opposingSide(Side.ROMAN));
    assertEquals(Side.ROMAN, game.opposingSide(Side.CARTHAGINIAN));
});

test("unit strength", () => {
    const game = makeGame(scenario);

    assertEquals(4, game.unitStrength(game.unitAt(hexOf(1, 5))));
    assertEquals(4, game.unitStrength(hexOf(1, 5)));
});

test("unit takes damage", () => {
    const game = makeGame(scenario);
    const unit = game.unitAt(hexOf(1, 5));

    game.takeDamage(unit, 1);

    assertEquals(3, game.unitStrength(unit));
});


xtest('clone game', () => {
    const game = makeGame(new TestScenario());
    game.killUnit(hexOf(1, 5));

    const clone = game.clone();

    /*
        The clone should be a deep copy of the original.

        considering the following properties:
        - scenario
        - dice
        - board *
        - turn  *
        - graveyard *

        starred properties are objects that should be deep copied
    */
    
    assertEquals(game.scenario, clone.scenario);
    assertEquals(game.dice, clone.dice);
    assertDeepEquals(game.board, clone.board);
    assertFalse(game.board === clone.board, "board is not a deep copy");
    assertDeepEquals(game.graveyard.unitsOf(Side.ROMAN), clone.graveyard.unitsOf(Side.ROMAN));
    assertFalse(game.graveyard === clone.graveyard, "graveyard is not a deep copy");
});
