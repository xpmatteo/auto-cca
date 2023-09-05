import { NullScenario } from "model/scenarios.js";
import makeGame from "model/game.js";
import { Side } from "model/side.js";
import { score } from "ai/score.js";
import { hexOf } from "xlib/hexlib.js";
import { RomanLightInfantry } from "model/units.js";

// 1 point for every unit with support
// 1 point for every dice you can roll


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
});
