import makeGame from "model/game.js";
import { AdvanceAfterCombatPhase } from "model/phases/advance_after_combat_phase.js";
import { NullScenario } from "model/scenarios.js";
import { RomanHeavyInfantry } from "model/units.js";
import { hexOf } from "xlib/hexlib.js";

test('highlight hexes', () => {
    const phase = new AdvanceAfterCombatPhase(hexOf(1,1), hexOf(0,0));

    expect(phase.hilightedHexes()).toStrictEqual(new Set([hexOf(1,1), hexOf(0,0)]));
});

describe('on click', () => {
    const game = makeGame(new NullScenario());
    const ourUnit = new RomanHeavyInfantry();
    game.placeUnit(hexOf(0, 0), ourUnit);
    const phase = new AdvanceAfterCombatPhase(hexOf(1,1), hexOf(0,0));

    phase.onClick(hexOf(1, 1), game);

    test('from hex is now empty', () => {
        expect(game.unitAt(hexOf(0, 0))).toBeUndefined();
    });
    test('to hex now has our unit', () => {
        expect(game.unitAt(hexOf(1, 1))).toBe(ourUnit);
    });
});

