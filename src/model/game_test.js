import { hexOf } from "../lib/hexlib.js";
import { assertEquals, assertFalse, assertTrue, assertDeepEquals, test } from "../lib/test_lib.js";
import makeGame from "./game.js";
import * as GameStatus from "./game_status.js";
import * as units from "./units.js";
import { Side } from "./side.js";
import { MoveCommand, EndPhaseCommand } from "./commands.js";
import { Scenario } from "./scenarios.js";

class TestScenario extends Scenario {
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

const scenario = new TestScenario();

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
