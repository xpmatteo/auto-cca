import { hexOf } from "../../lib/hexlib.js";
import { makeRangedCombatCommand } from "../commands/ranged_combat_command.js";
import { diceReturning, RESULT_HEAVY, RESULT_LIGHT, RESULT_SWORDS } from "../dice.js";
import { eventNames } from "../events.js";
import makeGame, { MovementTrail } from "../game.js";
import { NullScenario } from "../scenarios.js";
import { CarthaginianHeavyInfantry, RomanLightInfantry } from "../units.js";


test('RangedCombatCommand creation', () => {
    const command1 = makeRangedCombatCommand(hexOf(1, 2), hexOf(1, 3));
    const command2 = makeRangedCombatCommand(hexOf(1, 2), hexOf(1, 3));

    expect(Object.is(command1, command2)).toBe(true);
});


test("ranged combat play with 2 dice", () => {
    let game = makeGame(new NullScenario(), diceReturning([RESULT_HEAVY, RESULT_SWORDS]));
    let attacker = new RomanLightInfantry();
    let target = new CarthaginianHeavyInfantry();
    game.placeUnit(hexOf(1, 5), attacker);
    game.placeUnit(hexOf(1, 3), target);

    const events = game.executeCommand(makeRangedCombatCommand(hexOf(1, 3), hexOf(1, 5)));

    expect(game.spentUnits).toEqual([attacker]);
    expect(game.unitStrength(target)).toEqual(3);
    expect(eventNames(events).length).toEqual(["DamageEvent"].length);
    expect(new Set(eventNames(events))).toEqual(new Set(["DamageEvent"]));
});

test("ranged combat with 1 die if unit has moved", () => {
    let game = makeGame(new NullScenario(), diceReturning([RESULT_LIGHT]));
    let attacker = new RomanLightInfantry();
    let target = new CarthaginianHeavyInfantry();
    game.placeUnit(hexOf(1, 5), attacker);
    game.placeUnit(hexOf(1, 3), target);
    game.movementTrails.push(new MovementTrail(hexOf(1, 5)))

    game.executeCommand(makeRangedCombatCommand(hexOf(1, 3), hexOf(1, 5)));

    expect(game.spentUnits).toEqual([attacker]);
});

// ranged combat from unit that moved uses 1 die

// ranged combat can make unit retreat
