import { assertEquals, test } from "../lib/test_lib.js";
import makeGame from "../model/game.js";
import { NullScenario, TestScenario } from "../model/scenarios.js";
import { CarthaginianHeavyInfantry, RomanHeavyInfantry } from "../model/units.js";
import { hexOf } from "../lib/hexlib.js";
import * as GameStatus from "../model/game_status.js";
import { Side } from "../model/side.js";

// test a new playout policy "playoutUntilSwitchSidePolicy"
// This policy will keep executing random moves until the current side changes
// When this happens, it will evaluate which side is winning and return the game status


// test game status estimation
// will compare the graveyard size; the side with more points is winning
// otherwise it's a draw
test("gameStatusEstimation when game is ongoing", () => {
    const game = makeGame(new NullScenario());
    game.placeUnit(hexOf(0, 0), new CarthaginianHeavyInfantry());
    game.placeUnit(hexOf(1, 0), new CarthaginianHeavyInfantry());
    game.placeUnit(hexOf(0, 2), new RomanHeavyInfantry());
    game.placeUnit(hexOf(0, 3), new RomanHeavyInfantry());

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



test("playoutUntilSwitchSidePolicy", () => {
    // set up a game that will switch side after 2 moves

    // execute the policy

    // verify that the game advanced by 3 moves
});