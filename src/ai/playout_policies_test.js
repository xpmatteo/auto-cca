import { assertEquals, test } from "../lib/test_lib.js";
import makeGame from "../model/game.js";
import { NullScenario, TestScenario } from "../model/scenarios.js";
import { CarthaginianHeavyInfantry, RomanHeavyInfantry } from "../model/units.js";
import { hexOf } from "../lib/hexlib.js";
import GameStatus from "../model/game_status.js";
import { Side } from "../model/side.js";
import { fastPlayoutPolicy } from "./playout_policies.js";


function makeGameWithFourUnits() {
    const game = makeGame(new NullScenario());
    game.placeUnit(hexOf(0, 0), new CarthaginianHeavyInfantry());
    game.placeUnit(hexOf(1, 0), new CarthaginianHeavyInfantry());
    game.placeUnit(hexOf(0, 2), new RomanHeavyInfantry());
    game.placeUnit(hexOf(0, 3), new RomanHeavyInfantry());
    return game;
}

test('inflicted damage ', () => {
    const game = makeGameWithFourUnits();

    game.takeDamage(hexOf(0, 0), 2);
    game.takeDamage(hexOf(1, 0), 1);
    game.takeDamage(hexOf(0, 2), 3);

    assertEquals(3, game.inflictedDamage(Side.CARTHAGINIAN));
    assertEquals(3, game.inflictedDamage(Side.ROMAN));
});


test("game score when game is ongoing", () => {
    const game = makeGameWithFourUnits();

    assertEquals(0, game.score(Side.CARTHAGINIAN));
    assertEquals(0, game.score(Side.ROMAN));

    // after 1 carthaginian loss
    game.takeDamage(hexOf(0, 0), 4);
    assertEquals(-100, game.score(Side.CARTHAGINIAN));
    assertEquals(100, game.score(Side.ROMAN));

    // after 1 loss each
    game.takeDamage(hexOf(0, 2), 4);
    assertEquals(0, game.score(Side.CARTHAGINIAN));
    assertEquals(0, game.score(Side.ROMAN));

    // after 2 roman losses and 1 carth.
    game.takeDamage(hexOf(0, 3), 4);
    assertEquals(100, game.score(Side.CARTHAGINIAN));
    assertEquals(-100, game.score(Side.ROMAN));
});


// test game status estimation
// will compare the graveyard size; the side with more points is winning
// otherwise it's a draw
test("gameStatusEstimation when game is ongoing", () => {
    const game = makeGameWithFourUnits();

    // no unit killed yet
    assertEquals(GameStatus.DRAW, game.quickStatusEstimation());

    // after 1 carthaginian loss
    game.takeDamage(hexOf(0, 0), 4);
    assertEquals(GameStatus.ROMAN_WIN, game.quickStatusEstimation());

    // after 1 loss each
    game.takeDamage(hexOf(0, 2), 4);
    assertEquals(GameStatus.DRAW, game.quickStatusEstimation());

    // after 2 roman losses and 1 carth.
    game.takeDamage(hexOf(0, 3), 4);
    assertEquals(GameStatus.CARTHAGINIAN_WIN, game.quickStatusEstimation());
});

test("gameStatusEstimation when game is over", () => {
    const game = makeGame(new TestScenario());

    // no unit killed yet
    assertEquals(GameStatus.DRAW, game.quickStatusEstimation());

    // kill all Roman units
    game.foreachUnit((unit, hex) => {
        if (unit.side === Side.ROMAN) {
            game.takeDamage(hex, 4);
        }
    })

    assertEquals(GameStatus.CARTHAGINIAN_WIN, game.gameStatus, "expected Carthagininan win");
    assertEquals(GameStatus.CARTHAGINIAN_WIN, game.quickStatusEstimation(), "expected estimation to report the same");
});

// test a playout policy "playoutUntilSwitchSidePolicy"
// This policy will keep executing random moves until the current side changes
// When this happens, it will evaluate which side is winning and return the game status

test("fast playout Until Switch Side Policy", () => {
    const MAX_CARTHAGININAN_MOVES = 3;
    let moves = 0;
    const game = {
        currentSide: Side.CARTHAGINIAN,
        executeCommand: () => { if (moves++ === MAX_CARTHAGININAN_MOVES) game.currentSide = Side.ROMAN; },
        quickStatusEstimation: () => GameStatus.CARTHAGINIAN_WIN,
        validCommands: () => [moves],
        isTerminal: () => false,
    }

    const result = fastPlayoutPolicy(game);

    assertEquals(1 + MAX_CARTHAGININAN_MOVES, moves, "verify that the game advanced by 4 moves");
    assertEquals(result, GameStatus.CARTHAGINIAN_WIN, "verify that the result is taken from quickStatusEstimation");
});

test('fast playout will stop when game is over', () => {
    let moves = 0;
    const game = {
        currentSide: Side.CARTHAGINIAN,
        isTerminal: () => moves === 1,
        quickStatusEstimation: () => GameStatus.ROMAN_WIN,
        executeCommand: () => { moves++; },
        validCommands: () => [moves],
    }
    const result = fastPlayoutPolicy(game);

    assertEquals(1, moves, "stops as soon as game is terminal");
    assertEquals(result, GameStatus.ROMAN_WIN, "verify that the result is same as terminal status");
});