import { RandomPlayer } from "../ai/autoplay.js";
import { hexOf } from "../lib/hexlib.js";
import { EndPhaseCommand } from "./commands/end_phase_command.js";
import { MoveCommand } from "./commands/move_command.js";
import makeGame from "./game.js";
import GameStatus from "./game_status.js";
import { MeleeScenario, NullScenario } from "./scenarios.js";
import { Side } from "./side.js";
import * as units from "./units.js";

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

    expect(game.gameStatus).toEqual(GameStatus.ONGOING);
    expect(game.isTerminal()).toBe(false);
});

test("executeCommand - game over", () => {
    const game = makeGame(scenario);

    game.executeCommand(new EndPhaseCommand());
    game.executeCommand(new MoveCommand(hexOf(0, 5), hexOf(1, 5)));

    expect(game.gameStatus).toEqual(GameStatus.ROMAN_WIN);
    expect(game.isTerminal()).toBe(true);
    expect(game.validCommands().length).toEqual(0);
});

test("currentSide", () => {
    const cca = makeGame(scenario);

    expect(cca.currentSide).toEqual(Side.CARTHAGINIAN);
});

test("opposingSide", () => {
    const game = makeGame(scenario);

    expect(game.opposingSide(Side.ROMAN)).toEqual(Side.CARTHAGINIAN);
    expect(game.opposingSide(Side.CARTHAGINIAN)).toEqual(Side.ROMAN);
});

test("unit strength", () => {
    const game = makeGame(scenario);

    expect(game.unitStrength(game.unitAt(hexOf(1, 5)))).toEqual(4);
    expect(game.unitStrength(game.unitAt(hexOf(1, 5)))).toEqual(4);
});

test("unit takes damage", () => {
    const game = makeGame(scenario);
    const unit = game.unitAt(hexOf(1, 5));

    game.damageUnit(unit, 1);

    expect(game.unitStrength(unit)).toEqual(3);
});


test('clone game', () => {
    const game = makeGame(new MeleeScenario());
    const gameBeforeClone = JSON.stringify(game);

    // measure the time it takes to clone the game
    const start = performance.now();
    const clone = game.clone();
    const end = performance.now();
    // console.log("Cloning took " + (end - start) + " milliseconds.");
    expect(JSON.stringify(clone)).toEqual(gameBeforeClone);

    clone.executeCommand(new RandomPlayer().decideMove(clone)[0]);

    expect(JSON.stringify(game)).toEqual(gameBeforeClone);
});

test('unit support', function () {
    const game = makeGame(new NullScenario());

    game.placeUnit(hexOf(1, 1), new units.RomanHeavyInfantry());
    expect(game.isSupported(hexOf(1, 1))).toBe(false);

    game.placeUnit(hexOf(0, 2), new units.RomanHeavyInfantry());
    expect(game.isSupported(hexOf(1, 1))).toBe(false);

    game.placeUnit(hexOf(1, 2), new units.RomanHeavyInfantry());
    expect(game.isSupported(hexOf(1, 1))).toBe(true);
});

test('enemy units do not provide support', function () {
    const game = makeGame(new NullScenario());
    game.placeUnit(hexOf(1, 1), new units.RomanHeavyInfantry());
    game.placeUnit(hexOf(0, 2), new units.CarthaginianHeavyInfantry());
    game.placeUnit(hexOf(1, 2), new units.CarthaginianHeavyInfantry());

    expect(game.isSupported(hexOf(1, 1))).toBe(false);
});


describe('evasion paths', () => {
    test('no evasion paths', () => {
        const game = makeGame(new NullScenario());
        game.placeUnit(hexOf(1, 4), new units.RomanHeavyInfantry());
        game.placeUnit(hexOf(0, 5), new units.CarthaginianHeavyInfantry());
        game.placeUnit(hexOf(1, 5), new units.CarthaginianHeavyInfantry());

        expect(game.evasionPaths(hexOf(1, 4))).toEqual([]);
    });

    test('one evasion paths of length 1', () => {
        const game = makeGame(new NullScenario());
        game.placeUnit(hexOf(1, 4), new units.RomanHeavyInfantry());
        game.placeUnit(hexOf(0, 5), new units.CarthaginianHeavyInfantry());
        game.placeUnit(hexOf(0, 6), new units.CarthaginianHeavyInfantry());
        game.placeUnit(hexOf(1, 6), new units.CarthaginianHeavyInfantry());

        expect(game.evasionPaths(hexOf(1, 4)).toString()).toEqual([hexOf(1, 5)].toString());
    });

    test('one evasion paths of length 2', () => {
        const game = makeGame(new NullScenario());
        game.placeUnit(hexOf(1, 4), new units.RomanHeavyInfantry());
        game.placeUnit(hexOf(-1, 6), new units.CarthaginianHeavyInfantry());
        game.placeUnit(hexOf(0, 6), new units.CarthaginianHeavyInfantry());

        expect(game.evasionPaths(hexOf(1, 4)).toString()).toEqual([hexOf(1, 6)].toString());
    });

});
