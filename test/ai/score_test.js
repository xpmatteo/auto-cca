import {
    attackProximityScoreForHex,
    score,
    scoreForCloseCombatDice,
    scoreForDamageToEnemyUnit, scoreForOrderedUnits,
    scoreForRangedCombatDice,
    scoreForUnitsWithSupport
} from "ai/score.js";
import { OrderHeavyTroopsCard, OrderLightTroopsCard } from "model/cards.js";
import { PlayCardCommand } from "model/commands/play_card_command.js";
import makeGame from "model/game.js";
import { MeleeScenario, NullScenario } from "model/scenarios.js";
import { Side } from "model/side.js";
import { CarthaginianHeavyInfantry, RomanLightInfantry } from "model/units.js";
import { hexOf } from "xlib/hexlib.js";


test("default score is zero", () => {
    const game = makeGame(new NullScenario());

    expect(score(game, Side.ROMAN)).toBe(0);
    expect(score(game, Side.CARTHAGINIAN)).toBe(0);
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
    game.takeDamage(carthaginianHeavyInfantry, 1);

    expect(scoreForDamageToEnemyUnit(game, carthaginianHeavyInfantry)).toBe(10);
});

describe('attack proximity value', () => {
    test('single enemy unit', () => {
        const game = makeGame(new NullScenario());
        game.placeUnit(hexOf(0, 0), new RomanLightInfantry());
        game.placeUnit(hexOf(0, 2), new CarthaginianHeavyInfantry());

        expect(attackProximityScoreForHex(game, hexOf(0, 0), Side.CARTHAGINIAN)).toBe(0);
        expect(attackProximityScoreForHex(game, hexOf(1, 0), Side.CARTHAGINIAN)).toBe(250);
        expect(attackProximityScoreForHex(game, hexOf(2, 0), Side.CARTHAGINIAN)).toBeCloseTo(50);
        expect(attackProximityScoreForHex(game, hexOf(3, 0), Side.CARTHAGINIAN)).toBeCloseTo(10);
    });
});

test('score for orderable units', () => {
    const game = makeGame(new NullScenario());
    game.placeUnit(hexOf(0, 0), new RomanLightInfantry());
    game.currentCard = new OrderHeavyTroopsCard();
    expect(scoreForOrderedUnits(game)).toBe(0);

    game.currentCard = new OrderLightTroopsCard();
    expect(scoreForOrderedUnits(game)).toBe(1);
});
