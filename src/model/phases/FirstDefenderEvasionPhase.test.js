import { hexOf } from "../../lib/hexlib.js";
import { EvadeCommand } from "../commands/EvadeCommand.js";
import { FirstDefenderDoesNotEvadeCommand } from "../commands/FirstDefenderDoesNotEvadeCommand.js";
import { Side } from "../side.js";
import { FirstDefenderEvasionPhase } from "./FirstDefenderEvasionPhase.js";


describe('1st defender evasion phase', () => {
    const evasionHex0 = hexOf(0, 8);
    const evasionHex1 = hexOf(1, 8);
    const defendingHex = hexOf(1, 7);
    const attackingHex = hexOf(1, 6);
    const evasionPhase = new FirstDefenderEvasionPhase(
        Side.CARTHAGINIAN, [evasionHex0, evasionHex1], defendingHex, attackingHex);

    test('valid commands', () => {
        const commands = evasionPhase.validCommands(null);

        expect(commands.toString()).toEqual([
            new FirstDefenderDoesNotEvadeCommand(defendingHex, attackingHex),
            new EvadeCommand(evasionHex0, defendingHex, attackingHex),
            new EvadeCommand(evasionHex1, defendingHex, attackingHex),
        ].toString());
    });

    test('hilighted hexes', () => {
        const hiligthedHexes = evasionPhase.hilightedHexes(null);

        expect(hiligthedHexes).toEqual(new Set([
            defendingHex, evasionHex0, evasionHex1
        ]));
    });

    test('onclick', () => {
        expect(evasionPhase.onClick(hexOf(0, 0))).toBeUndefined();
        expect(evasionPhase.onClick(defendingHex)).toEqual(new FirstDefenderDoesNotEvadeCommand(defendingHex, attackingHex));
        expect(evasionPhase.onClick(evasionHex0).toString()).toEqual(new EvadeCommand(evasionHex0, defendingHex, attackingHex).toString());
    });
});
