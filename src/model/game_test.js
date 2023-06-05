import { hexOf } from "../lib/hexlib.js";
import { assertEquals, assertFalse, assertTrue, assertDeepEquals, test } from "../lib/test_lib.js";
import { Cca } from "./game.js";
import * as GameStatus from "./game_status.js";
import * as units from "./units.js";
import { Side } from "./side.js";
import { EndOfTurn } from "./turn.js";
import { MoveCommand } from "./commands.js";

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
    const cca = new Cca(scenario);

    assertEquals(GameStatus.ONGOING, cca.gameStatus);
    assertFalse(cca.isTerminal(), "game is not terminal?!?")
});

test("validCommands", () => {
    const cca = new Cca(scenario);

    let validCommands = cca.validCommands();

    // the only unit on board is Roman, first player is Carthaginian
    assertDeepEquals([new EndOfTurn()], validCommands);
});

test("executeCommand", () => {
    const cca = new Cca(scenario);

    cca.executeCommand(new EndOfTurn());

    assertEquals(Side.ROMAN, cca.currentSide);
    assertEquals(GameStatus.ONGOING, cca.gameStatus);
    assertEquals(6, cca.validCommands().length);
});

test("executeCommand - game over", () => {
    const cca = new Cca(scenario);

    cca.executeCommand(new EndOfTurn());
    cca.executeCommand(new MoveCommand(hexOf(0, 5), hexOf(1, 5)));

    assertEquals(GameStatus.ROMAN_WIN, cca.gameStatus);
    assertTrue(cca.isTerminal(), "game is not terminal?!?");
    assertEquals(0, cca.validCommands().length);
});

test("currentSide", () => {
    const cca = new Cca(scenario);

    assertEquals(Side.CARTHAGINIAN, cca.currentSide);
});

