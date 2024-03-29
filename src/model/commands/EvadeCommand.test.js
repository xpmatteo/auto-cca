import { hexOf } from "../../lib/hexlib.js";
import { diceReturning, RESULT_LIGHT, RESULT_SWORDS } from "../dice.js";
import makeGame from "../game.js";
import { BattlePhase } from "../phases/BattlePhase.js";
import { FirstDefenderEvasionPhase } from "../phases/FirstDefenderEvasionPhase.js";
import { NullScenario } from "../scenarios.js";
import { Side } from "../side.js";
import { CarthaginianHeavyInfantry, RomanLightInfantry } from "../units.js";
import { makeEvadeCommand } from "./EvadeCommand.js";

test('EvadeCommandCreation', () => {
    const command1 = makeEvadeCommand(hexOf(0, 6), hexOf(1, 4), hexOf(1, 5));
    const command2 = makeEvadeCommand(hexOf(0, 6), hexOf(1, 4), hexOf(1, 5));

    expect(Object.is(command1, command2)).toBe(true);
});

describe('evade command', () => {
    const game = makeGame(new NullScenario(), diceReturning([RESULT_LIGHT, RESULT_SWORDS, RESULT_SWORDS, RESULT_SWORDS, RESULT_SWORDS]));
    const evadingUnit = new RomanLightInfantry();
    const attackingUnit = new CarthaginianHeavyInfantry();
    game.placeUnit(hexOf(1, 4), evadingUnit);
    game.placeUnit(hexOf(1, 5), attackingUnit);
    game.unshiftPhase(new BattlePhase());
    game.unshiftPhase(new FirstDefenderEvasionPhase(Side.ROMAN, [hexOf(0, 6)], hexOf(1, 4), hexOf(1, 5)));
    const evadeCommand = makeEvadeCommand(hexOf(0, 6), hexOf(1, 4), hexOf(1, 5));

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

    test('it spends the attacking unit', () => {
        expect(game.isSpent(attackingUnit)).toBeTruthy();
    });

});

test('It can kill the evading unit', () => {
    const game = makeGame(new NullScenario(), diceReturning([RESULT_LIGHT, RESULT_LIGHT, RESULT_LIGHT, RESULT_LIGHT, RESULT_SWORDS]));
    const evadingUnit = new RomanLightInfantry();
    const attackingUnit = new CarthaginianHeavyInfantry();
    game.placeUnit(hexOf(1, 4), evadingUnit);
    game.placeUnit(hexOf(1, 5), attackingUnit);
    game.unshiftPhase(new BattlePhase());
    game.unshiftPhase(new FirstDefenderEvasionPhase(Side.ROMAN, [hexOf(0, 6)], hexOf(1, 4), hexOf(1, 5)));
    const evadeCommand = makeEvadeCommand(hexOf(0, 6), hexOf(1, 4), hexOf(1, 5));

    const events = evadeCommand.play(game);

    expect(game.unitAt(hexOf(0, 6))).toBeUndefined();
    expect(events.map(e => e.toString())).toEqual([
        "Defender evades to [0,6]",
        "Carthaginian heavy infantry damages Roman light infantry at [1,4] for 4 damage with light,light,light,light,swords",
        "Roman light infantry killed at [1,4]",
    ]);
    expect(game.graveyard.unitsOf(Side.ROMAN)).toContain(evadingUnit);
});
