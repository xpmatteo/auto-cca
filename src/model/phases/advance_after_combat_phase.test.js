import { RetreatCommand } from "../commands/retreatCommand.js";
import makeGame from "../game.js";
import { AdvanceAfterCombatPhase } from "./advance_after_combat_phase.js";
import { NullScenario } from "../scenarios.js";
import { CarthaginianHeavyInfantry, RomanHeavyInfantry } from "../units.js";
import { hexOf } from "../../lib/hexlib.js";

test('highlight hexes', () => {
    const game = makeGame(new NullScenario());
    const phase = new AdvanceAfterCombatPhase(hexOf(1,1), hexOf(0,0));

    expect(phase.hilightedHexes(game)).toStrictEqual(new Set([hexOf(1,1), hexOf(0,0)]));
});

describe('valid commands', () => {
    test('when opponent vacated the hex', () => {
        const game = makeGame(new NullScenario());
        const ourUnit = new RomanHeavyInfantry();
        game.placeUnit(hexOf(0, 0), ourUnit);
        const phase = new AdvanceAfterCombatPhase(hexOf(1,1), hexOf(0,0));

        expect(phase.validCommands(game)).toStrictEqual([
            new RetreatCommand(hexOf(1,1), hexOf(0,0)),
            new RetreatCommand(hexOf(0,0), hexOf(0,0)),
        ]);
    });

    test('when opponent did not vacate the hex', () => {
        const game = makeGame(new NullScenario());
        const ourUnit = new RomanHeavyInfantry();
        const enemyUnit = new CarthaginianHeavyInfantry();
        game.placeUnit(hexOf(0, 0), ourUnit);
        game.placeUnit(hexOf(1, 1), enemyUnit);
        const phase = new AdvanceAfterCombatPhase(hexOf(1,1), hexOf(0,0));

        expect(phase.validCommands(game)).toStrictEqual([
            new RetreatCommand(hexOf(0,0), hexOf(0,0)),
        ]);
    });
});

describe('on click', () => {
    const game = makeGame(new NullScenario());
    const ourUnit = new RomanHeavyInfantry();
    game.placeUnit(hexOf(0, 0), ourUnit);
    const phase = new AdvanceAfterCombatPhase(hexOf(1,1), hexOf(0,0));

    game.executeCommand(phase.onClick(hexOf(1, 1), game));

    test('from hex is now empty', () => {
        expect(game.unitAt(hexOf(0, 0))).toBeUndefined();
    });
    test('to hex now has our unit', () => {
        expect(game.unitAt(hexOf(1, 1))).toBe(ourUnit);
    });
});

