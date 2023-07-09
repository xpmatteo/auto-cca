import { hexOf } from "../lib/hexlib.js";
import {
    assertDeepEquals,
    assertEquals,
    assertEqualsInAnyOrder,
    assertFalse,
    assertTrue,
    test
} from "../lib/test_lib.js";
import makeGame from "./game.js";
import GameStatus from "./game_status.js";
import * as units from "./units.js";
import { Side } from "./side.js";
import { NullScenario, TestScenario } from "./scenarios.js";
import { Autoplay } from "../ai/autoplay.js";
import { MoveCommand } from "./commands/move_command.js";
import { EndPhaseCommand } from "./commands/end_phase_command.js";

class SimpleScenario extends NullScenario {
    firstSide = Side.CARTHAGINIAN;

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
    assertEquals(4, game.unitStrength(game.unitAt(hexOf(1, 5))));
});

test("unit takes damage", () => {
    const game = makeGame(scenario);
    const unit = game.unitAt(hexOf(1, 5));

    game.takeDamage(unit, 1);

    assertEquals(3, game.unitStrength(unit));
});


test('clone game', () => {
    const game = makeGame(new TestScenario());
    const gameBeforeClone = JSON.stringify(game);

    // measure the time it takes to clone the game
    const start = performance.now();
    const clone = game.clone();
    const end = performance.now();
    console.log("Cloning took " + (end - start) + " milliseconds.");
    assertEquals(gameBeforeClone, JSON.stringify(clone));

    const autoplayStart = performance.now();
    new Autoplay(clone).randomPlayout();
    const autoplayEnd = performance.now();
    console.log("Autoplay took " + (autoplayEnd - autoplayStart) + " milliseconds.");

    assertEquals(gameBeforeClone, JSON.stringify(game));
});

test('unit support', function () {
    const game = makeGame(new NullScenario());

    game.placeUnit(hexOf(1, 1), new units.RomanHeavyInfantry());
    assertFalse(game.isSupported(hexOf(1, 1)), "unit alone is not supported");

    game.placeUnit(hexOf(0, 2), new units.RomanHeavyInfantry());
    assertFalse(game.isSupported(hexOf(1, 1)), "with just one adjacent unit, unit is not supported");

    game.placeUnit(hexOf(1, 2), new units.RomanHeavyInfantry());
    assertTrue(game.isSupported(hexOf(1, 1)), "with just two adjacent units, unit is supported");
});

test('enemy units do not provide support', function () {
    const game = makeGame(new NullScenario());
    game.placeUnit(hexOf(1, 1), new units.RomanHeavyInfantry());
    game.placeUnit(hexOf(0, 2), new units.CarthaginianHeavyInfantry());
    game.placeUnit(hexOf(1, 2), new units.CarthaginianHeavyInfantry());

    assertFalse(game.isSupported(hexOf(1, 1)), "enemy units do not provide support");
});
