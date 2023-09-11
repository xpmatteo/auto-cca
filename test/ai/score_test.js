import { NullScenario } from "model/scenarios.js";
import makeGame from "model/game.js";
import { Side } from "model/side.js";
import { score } from "ai/score.js";
import { hexOf } from "xlib/hexlib.js";
import { CarthaginianHeavyInfantry, RomanLightInfantry } from "model/units.js";


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

    expect(score(game, Side.ROMAN)).toBe(2);
    expect(score(game, Side.CARTHAGINIAN)).toBe(0);
});

test("score one point for every die you can roll in close combat", () => {
    const game = makeGame(new NullScenario());
    game.placeUnit(hexOf(0, 0), new RomanLightInfantry()); // two dice
    game.placeUnit(hexOf(1, 0), new CarthaginianHeavyInfantry()); // five dice

    expect(score(game, Side.ROMAN)).toBe(2);
    expect(score(game, Side.CARTHAGINIAN)).toBe(5);
});

test("score one point for every die you can roll in ranged combat", () => {
    const game = makeGame(new NullScenario());
    game.placeUnit(hexOf(0, 0), new RomanLightInfantry()); // two dice
    game.placeUnit(hexOf(2, 0), new CarthaginianHeavyInfantry()); // no ranged combat

    expect(score(game, Side.ROMAN)).toBe(2);
    expect(score(game, Side.CARTHAGINIAN)).toBe(0);
});

test("take into account that units that moved have fewer dice", () => {
    const game = makeGame(new NullScenario());
    game.placeUnit(hexOf(0, 0), new RomanLightInfantry()); // two dice
    game.addMovementTrail(hexOf(0, 0), hexOf(1, 0)); // moved, so only one die
    game.placeUnit(hexOf(2, 0), new CarthaginianHeavyInfantry()); // no ranged combat

    expect(score(game, Side.ROMAN)).toBe(1);
    expect(score(game, Side.CARTHAGINIAN)).toBe(0);
});

test('score 10 for every point of damage', () => {
    const game = makeGame(new NullScenario());
    game.placeUnit(hexOf(0, 0), new RomanLightInfantry());
    const enemyUnit = new CarthaginianHeavyInfantry();
    game.placeUnit(hexOf(10, 0), enemyUnit);
    game.takeDamage(enemyUnit, 1);

    expect(score(game, Side.ROMAN)).toBe(10);
    expect(score(game, Side.CARTHAGINIAN)).toBe(0);
});
