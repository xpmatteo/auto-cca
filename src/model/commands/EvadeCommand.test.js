import { hexOf } from "../../lib/hexlib.js";
import makeGame from "../game.js";
import { BattlePhase } from "../phases/BattlePhase.js";
import { FirstDefenderEvasionPhase } from "../phases/FirstDefenderEvasionPhase.js";
import { NullScenario } from "../scenarios.js";
import { RomanLightInfantry } from "../units.js";
import { EvadeCommand } from "./EvadeCommand.js";

describe('evade command', () => {
    const game = makeGame(new NullScenario());
    const evadingUnit = new RomanLightInfantry();
    game.placeUnit(hexOf(1, 4), evadingUnit);
    game.unshiftPhase(new BattlePhase());
    game.unshiftPhase(new FirstDefenderEvasionPhase([hexOf(0, 6)], hexOf(1, 4)));
    const evadeCommand = new EvadeCommand(hexOf(0, 6), hexOf(1, 4));

    const events = evadeCommand.play(game);

    test('it removes the evasion phase', () => {
        expect(game.currentPhase.toString()).toBe("battle");
    });

    test('it returns an appropriate event', () => {
        expect(events.toString()).toEqual("Defender evades to [0,6]");
    });

    test('it moves the unit', () => {
        expect(game.hexOfUnit(evadingUnit).toString()).toBe(hexOf(0, 6).toString());
    });
});
