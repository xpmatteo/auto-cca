import {
    attackProximityScoreForHex,
    scoreGreedy,
    scoreForCloseCombatDice,
    scoreForDamageToUnit,
    scoreForRangedCombatDice,
    scoreForUnitsWithSupport
} from "./score.js";
import makeGame from "../model/game.js";
import { NullScenario } from "../model/scenarios.js";
import { Side } from "../model/side.js";
import { CarthaginianHeavyInfantry, RomanLightInfantry } from "../model/units.js";
import { hexOf } from "../lib/hexlib.js";


test("default score is zero", () => {
    const game = makeGame(new NullScenario());

    expect(scoreGreedy(game, Side.ROMAN)).toBe(0);
    expect(scoreGreedy(game, Side.CARTHAGINIAN)).toBe(0);
});

test("score one point for every unit with support", () => {
    const game = makeGame(new NullScenario());
    game.placeUnit(hexOf(0, 0), new RomanLightInfantry()); // no support
    game.placeUnit(hexOf(1, 0), new RomanLightInfantry()); // support
    game.placeUnit(hexOf(2, 0), new RomanLightInfantry()); // support
    game.placeUnit(hexOf(3, 0), new RomanLightInfantry()); // no support

    expect(scoreForUnitsWithSupport(game, hexOf(0, 0))).toBe(0);
    expect(scoreForUnitsWithSupport(game, hexOf(1, 0))).toBe(1);
    expect(scoreForUnitsWithSupport(game, hexOf(2, 0))).toBe(1);
    expect(scoreForUnitsWithSupport(game, hexOf(3, 0))).toBe(0);
});

const romanLightInfantry = new RomanLightInfantry();
const carthaginianHeavyInfantry = new CarthaginianHeavyInfantry();

test("score one point for every die you can roll in close combat", () => {
    const game = makeGame(new NullScenario());
    game.placeUnit(hexOf(0, 0), romanLightInfantry); // two dice
    game.placeUnit(hexOf(1, 0), carthaginianHeavyInfantry); // five dice

    expect(scoreForCloseCombatDice(game, romanLightInfantry, hexOf(0,0))).toBe(2);
    expect(scoreForCloseCombatDice(game, carthaginianHeavyInfantry, hexOf(1,0))).toBe(5);
});

test("score one point for every die you can roll in ranged combat", () => {
    const game = makeGame(new NullScenario());
    game.placeUnit(hexOf(0, 0), romanLightInfantry); // two dice
    game.placeUnit(hexOf(2, 0), carthaginianHeavyInfantry); // no ranged combat

    expect(scoreForRangedCombatDice(game, romanLightInfantry, hexOf(0, 0))).toBe(2);
    expect(scoreForRangedCombatDice(game, carthaginianHeavyInfantry, hexOf(2, 0))).toBe(0);
});

test("take into account that units that moved have fewer dice", () => {
    const game = makeGame(new NullScenario());
    game.placeUnit(hexOf(0, 0), romanLightInfantry); // two dice
    game.addMovementTrail(hexOf(0, 0), hexOf(1, 0)); // moved, so only one die
    game.placeUnit(hexOf(2, 0), carthaginianHeavyInfantry); // no ranged combat

    expect(scoreForRangedCombatDice(game, romanLightInfantry, hexOf(0, 0))).toBe(1);
});

test('score 10 for every point of damage', () => {
    const game = makeGame(new NullScenario());
    game.placeUnit(hexOf(10, 0), carthaginianHeavyInfantry);
    game.damageUnit(carthaginianHeavyInfantry, 1);

    expect(scoreForDamageToUnit(game, carthaginianHeavyInfantry)).toBe(10);
});

describe('attack proximity value', () => {
    test('single enemy unit', () => {
        const game = makeGame(new NullScenario());
        game.placeUnit(hexOf(0, 0), new RomanLightInfantry());
        const unit = new CarthaginianHeavyInfantry();
        game.placeUnit(hexOf(0, 2), unit);

        expect(attackProximityScoreForHex(game, unit, hexOf(0, 0))).toBe(0);
        expect(attackProximityScoreForHex(game, unit, hexOf(1, 0))).toBe(1250);
        expect(attackProximityScoreForHex(game, unit, hexOf(2, 0))).toBeCloseTo(250);
        expect(attackProximityScoreForHex(game, unit, hexOf(3, 0))).toBeCloseTo(50);
    });
});

