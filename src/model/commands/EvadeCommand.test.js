import { hexOf } from "../../lib/hexlib.js";
import { diceReturning, RESULT_LIGHT, RESULT_SWORDS } from "../dice.js";
import makeGame from "../game.js";
import { BattlePhase } from "../phases/BattlePhase.js";
import { FirstDefenderEvasionPhase } from "../phases/FirstDefenderEvasionPhase.js";
import { NullScenario } from "../scenarios.js";
import { Side } from "../side.js";
import { CarthaginianHeavyInfantry, RomanLightInfantry } from "../units.js";
import { EvadeCommand } from "./EvadeCommand.js";

describe('evade command', () => {
    const game = makeGame(new NullScenario(), diceReturning([RESULT_LIGHT, RESULT_SWORDS, RESULT_SWORDS, RESULT_SWORDS, RESULT_SWORDS]));
    const evadingUnit = new RomanLightInfantry();
    const attackingUnit = new CarthaginianHeavyInfantry();
    game.placeUnit(hexOf(1, 4), evadingUnit);
    game.placeUnit(hexOf(1, 5), attackingUnit);
    game.unshiftPhase(new BattlePhase());
    game.unshiftPhase(new FirstDefenderEvasionPhase(Side.ROMAN, [hexOf(0, 6)], hexOf(1, 4), hexOf(1, 5)));
    const evadeCommand = new EvadeCommand(hexOf(0, 6), hexOf(1, 4), hexOf(1, 5));

    const events = evadeCommand.play(game);

    test('it removes the evasion phase', () => {
        expect(game.currentPhase.toString()).toBe("battle");
    });

    test('it returns an appropriate event', () => {
        expect(events.map(e => e.toString())).toEqual([
            "Defender evades to [0,6]",
            "Carthaginian heavy infantry damages Roman light infantry at [1,4] for 1 damage with light,swords,swords,swords,swords",
        ]);
    });

    test('it moves the unit', () => {
        expect(game.hexOfUnit(evadingUnit).toString()).toBe(hexOf(0, 6).toString());
    });

    test('it rolls for damage', () => {
        expect(game.unitStrength(evadingUnit)).toBe(3);
    });
});
