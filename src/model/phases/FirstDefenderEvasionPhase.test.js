import { hexOf } from "../../lib/hexlib.js";
import { EvadeCommand } from "../commands/EvadeCommand.js";
import { FirstDefenderDoesNotEvadeCommand } from "../commands/FirstDefenderDoesNotEvadeCommand.js";
import makeGame from "../game.js";
import { NullScenario } from "../scenarios.js";
import { RomanHeavyInfantry } from "../units.js";
import { FirstDefenderEvasionPhase } from "./FirstDefenderEvasionPhase.js";



describe('1st defender evasion phase', () => {
    const evasionPhase = new FirstDefenderEvasionPhase([hexOf(0, 8), hexOf(1, 8)], hexOf(1,7));

    test('valid commands', () => {
        const commands = evasionPhase.validCommands(null);

        expect(commands.toString()).toEqual([
            new FirstDefenderDoesNotEvadeCommand(),
            new EvadeCommand(hexOf(0, 8), hexOf(1, 7)),
            new EvadeCommand(hexOf(1, 8), hexOf(1, 7)),
        ].toString());
    });

    test('hilighted hexes', () => {
        const hiligthedHexes = evasionPhase.hilightedHexes(null);

        expect(hiligthedHexes).toEqual(new Set([
            hexOf(1,7), hexOf(0, 8), hexOf(1, 8)
        ]));
    });

    test('onclick', () => {
        expect(evasionPhase.onClick(hexOf(0, 0))).toBeUndefined();
        expect(evasionPhase.onClick(hexOf(1, 7))).toEqual(new FirstDefenderDoesNotEvadeCommand());
        expect(evasionPhase.onClick(hexOf(0, 8)).toString()).toEqual(new EvadeCommand(hexOf(0, 8), hexOf(1, 7)).toString());
    });
});
