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

    game.takeDamage(game.unitAt(hexOf(1, 0)), 1);
    game.takeDamage(game.unitAt(hexOf(0, 2)), 3);
    game.takeDamage(game.unitAt(hexOf(0, 0)), 2);

    expect(game.inflictedDamage(Side.CARTHAGINIAN)).toEqual(3);
    expect(game.inflictedDamage(Side.ROMAN)).toEqual(3);
});

xtest("game score when game is ongoing", () => {
    const game = makeGameWithFourUnits();

    expect(game.score(Side.CARTHAGINIAN)).toEqual(0);
    expect(game.score(Side.ROMAN)).toEqual(0);

    // after 1 carthaginian loss
    game.takeDamage(game.unitAt(hexOf(0, 0)), 4);
    expect(game.score(Side.CARTHAGINIAN)).toEqual(-1);
    expect(game.score(Side.ROMAN)).toEqual(1);

    // after 1 loss each
    game.takeDamage(game.unitAt(hexOf(0, 2)), 4);
    expect(game.score(Side.CARTHAGINIAN)).toEqual(0);
    expect(game.score(Side.ROMAN)).toEqual(0);

    // after 2 roman losses and 1 carth.
    game.takeDamage(game.unitAt(hexOf(0, 3)), 4);
    expect(game.score(Side.CARTHAGINIAN)).toEqual(1);
    expect(game.score(Side.ROMAN)).toEqual(-1);
});

xtest("game score when game is over", () => {
    const game = makeGame(new TestScenario());

    // kill all Roman units
    game.foreachUnit((unit, hex) => {
        if (unit.side === Side.ROMAN) {
            game.takeDamage(game.unitAt(hex), 4);
        }
    })

    expect(game.score(Side.CARTHAGINIAN)).toEqual(10);
    expect(game.score(Side.ROMAN)).toEqual(-10);
});

test("gameStatusEstimation when game is over", () => {
    const game = makeGame(new TestScenario());

    // kill all Roman units
    game.foreachUnit((unit, hex) => {
        if (unit.side === Side.ROMAN) {
            game.takeDamage(unit, 4);
        }
    })

    expect(game.gameStatus).toEqual(GameStatus.CARTHAGINIAN_WIN);
});

// test a playout policy "playoutUntilSwitchSidePolicy"
// This policy will keep executing random moves until the current side changes
// When this happens, it will evaluate which side is winning and return the game status

test("fast playout Until Switch Side Policy", () => {
    const MAX_CARTHAGININAN_MOVES = 3;
    let moves = 0;
    const game = {
        currentSideRaw: Side.CARTHAGINIAN,
        executeCommand: () => { if (moves++ === MAX_CARTHAGININAN_MOVES) game.currentSideRaw = Side.ROMAN; },
        validCommands: () => [{value: () => 0}],
        isTerminal: () => false,
    }

    fastPlayoutPolicy(game);

    expect(moves).toEqual(1 + MAX_CARTHAGININAN_MOVES);
});

test('fast playout will stop when game is over', () => {
    let moves = 0;
    const game = {
        currentSideRaw: Side.CARTHAGINIAN,
        isTerminal: () => moves === 1,
        executeCommand: () => { moves++; },
        validCommands: () => [{value: () => 0}],
    }
    fastPlayoutPolicy(game);

    expect(moves).toEqual(1);
});

// test('score in test scenario', () => {
//    let game = makeGame(new TestScenario());
//    assertEquals(0, game.score(Side.CARTHAGINIAN));
//    game.executeCommand(new EndPhaseCommand());
//    game.executeCommand(new EndPhaseCommand());
//
//    let [commands, events] = fastPlayoutPolicy(game);
//     console.log(commands.join('\n').toString());
//     console.log(events.join('\n').toString());
//     console.log(game.score(Side.CARTHAGINIAN));
// });
