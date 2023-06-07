import { hexOf } from "../lib/hexlib.js";
import { assertEquals, assertFalse, assertTrue, assertDeepEquals, test } from "../lib/test_lib.js";
import makeGame from "./game.js";
import * as GameStatus from "./game_status.js";
import * as units from "./units.js";
import { Side } from "./side.js";
import { MoveCommand, EndPhaseCommand } from "./commands.js";

class TestScenario {
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
    const cca = makeGame(scenario);
    cca.initialize();

    assertEquals(GameStatus.ONGOING, cca.gameStatus);
    assertFalse(cca.isTerminal(), "game is not terminal?!?")
});

test("validCommands", () => {
    const cca = makeGame(scenario);
    cca.initialize();

    let validCommands = cca.validCommands();

    // the only unit on board is Roman, first player is Carthaginian
    assertDeepEquals([new EndPhaseCommand()], validCommands);
});

test("executeCommand", () => {
    const cca = makeGame(scenario);
    cca.initialize();

    cca.executeCommand(new EndPhaseCommand());

    assertEquals(Side.ROMAN, cca.currentSide);
    assertEquals(GameStatus.ONGOING, cca.gameStatus);
    assertEquals(6, cca.validCommands().length);
});

test("executeCommand - game over", () => {
    const cca = makeGame(scenario);
    cca.initialize();

    cca.executeCommand(new EndPhaseCommand());
    cca.executeCommand(new MoveCommand(hexOf(0, 5), hexOf(1, 5)));

    assertEquals(GameStatus.ROMAN_WIN, cca.gameStatus);
    assertTrue(cca.isTerminal(), "game is not terminal?!?");
    assertEquals(0, cca.validCommands().length);
});

test("currentSide", () => {
    const cca = makeGame(scenario);
    cca.initialize();
    
    assertEquals(Side.CARTHAGINIAN, cca.currentSide);
});

