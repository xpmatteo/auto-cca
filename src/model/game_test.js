import {hexOf} from "../lib/hexlib.js";
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
import {Side} from "./side.js";
import {NullScenario, TestScenario} from "./scenarios.js";
import {Autoplay} from "../ai/autoplay.js";
import {MoveCommand} from "./commands/moveCommand.js";
import {EndPhaseCommand} from "./commands/endPhaseCommand.js";

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

// test('playout the test scenario', () => {
//     // repeat N times
//     const N = 1000;
//     let romanWins = 0;
//     let carthaginianWins = 0;
//     for (let i = 0; i < N; i++) {
//         const game = makeGame(new TestScenario());
//         new Autoplay(game).fastPlayout();
//         if (game.gameStatus === GameStatus.ROMAN_WIN) {
//             romanWins++;
//         } else if (game.gameStatus === GameStatus.CARTHAGINIAN_WIN) {
//             carthaginianWins++;
//         } else {
//             throw new Error("Game is not terminal: " + clone.gameStatus);
//         }
//     }
//     console.log("Roman wins: " + romanWins + ", Carthaginian wins: " + carthaginianWins);
// });

test('eventually switch side', function () {
    const game = makeGame(new NullScenario());
    game.placeUnit(hexOf(1, 1), new units.RomanHeavyInfantry());

    game.executeCommand(new MoveCommand(hexOf(1, 0), hexOf(1, 1)));

    assertEquals("End phase", game.validCommands().toString());
});

test('play move then spent', function () {
    const g = makeGame(new NullScenario());
    let unit0 = new units.RomanHeavyInfantry();
    let unit1 = new units.RomanHeavyInfantry();
    g.placeUnit(hexOf(2, 5), unit0);
    g.placeUnit(hexOf(3, 5), unit1);

    g.executeCommand(new MoveCommand(hexOf(1, 5), hexOf(2, 5)));

    assertEquals(unit0, g.unitAt(hexOf(1, 5)));
    let commands = g.validCommands();
    let expected = [
        new MoveCommand(hexOf(3, 4), hexOf(3, 5)),
        new MoveCommand(hexOf(4, 4), hexOf(3, 5)),
        new MoveCommand(hexOf(2, 5), hexOf(3, 5)),
        new MoveCommand(hexOf(4, 5), hexOf(3, 5)),
        new MoveCommand(hexOf(2, 6), hexOf(3, 5)),
        new MoveCommand(hexOf(3, 6), hexOf(3, 5)),

        new EndPhaseCommand(),
    ];
    assertEqualsInAnyOrder(expected, commands);
});
