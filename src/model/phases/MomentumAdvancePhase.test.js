import { hexOf } from "../../lib/hexlib.js";
import { makeMomentumAdvanceCommand } from "../commands/MomentumAdvanceCommand.js";
import { makeRetreatCommand } from "../commands/retreatCommand.js";
import { makeSkipMomentumAdvanceCommand } from "../commands/SkipMomentumAdvanceCommand.js";
import makeGame from "../game.js";
import { NullScenario } from "../scenarios.js";
import { CarthaginianHeavyInfantry, RomanHeavyInfantry } from "../units.js";
import { MomentumAdvancePhase } from "./MomentumAdvancePhase.js";

test('highlight hexes', () => {
    const game = makeGame(new NullScenario());
    const phase = new MomentumAdvancePhase(hexOf(1,1), hexOf(0,0));

    expect(phase.hilightedHexes(game)).toStrictEqual(new Set([hexOf(1,1), hexOf(0,0)]));
});

describe('valid commands', () => {
    test('when opponent vacated the hex', () => {
        const game = makeGame(new NullScenario());
        const ourUnit = new RomanHeavyInfantry();
        game.placeUnit(hexOf(0, 0), ourUnit);
        const phase = new MomentumAdvancePhase(hexOf(1,1), hexOf(0,0));

        expect(phase.validCommands(game).toString()).toEqual([
            makeMomentumAdvanceCommand(hexOf(1,1), hexOf(0,0)),
            makeSkipMomentumAdvanceCommand(hexOf(0,0)),
        ].toString());
    });

    test('when opponent did not vacate the hex', () => {
        const game = makeGame(new NullScenario());
        const ourUnit = new RomanHeavyInfantry();
        const enemyUnit = new CarthaginianHeavyInfantry();
        game.placeUnit(hexOf(0, 0), ourUnit);
        game.placeUnit(hexOf(1, 1), enemyUnit);
        const phase = new MomentumAdvancePhase(hexOf(1,1), hexOf(0,0));

        expect(phase.validCommands(game).toString()).toEqual([
            makeSkipMomentumAdvanceCommand(hexOf(0,0)),
        ].toString());
    });
});

describe('on click', () => {
    const game = makeGame(new NullScenario());
    const ourUnit = new RomanHeavyInfantry();
    game.placeUnit(hexOf(0, 0), ourUnit);
    const phase = new MomentumAdvancePhase(hexOf(1,1), hexOf(0,0));

    game.executeCommand(phase.onClick(hexOf(1, 1), game));

    test('from hex is now empty', () => {
        expect(game.unitAt(hexOf(0, 0))).toBeUndefined();
    });
    test('to hex now has our unit', () => {
        expect(game.unitAt(hexOf(1, 1))).toBe(ourUnit);
    });
});

