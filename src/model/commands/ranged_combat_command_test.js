import { assertDeepEquals, assertEquals, assertEqualsInAnyOrder, test } from "../../lib/test_lib.js";
import makeGame, { MovementTrail } from "../game.js";
import { NullScenario } from "../scenarios.js";
import { CarthaginianHeavyInfantry, RomanHeavyInfantry, RomanLightInfantry } from "../units.js";
import { hexOf } from "../../lib/hexlib.js";
import { RangedCombatCommand } from "./ranged_combat_command.js";
import { diceReturning, eventNames } from "../game_combat_test.js";
import { RESULT_HEAVY, RESULT_LIGHT, RESULT_SWORDS } from "../dice.js";
import { DamageEvent } from "../events.js";


test("ranged combat play with 2 dice", () => {
    let game = makeGame(new NullScenario(), diceReturning([RESULT_HEAVY, RESULT_SWORDS]));
    let attacker = new RomanLightInfantry();
    let target = new CarthaginianHeavyInfantry();
    game.placeUnit(hexOf(1, 5), attacker);
    game.placeUnit(hexOf(1, 3), target);

    const events = game.executeCommand(new RangedCombatCommand(hexOf(1, 3), hexOf(1, 5)));

    assertDeepEquals([attacker], game.spentUnits);
    assertEquals(3, game.unitStrength(target));
    assertEqualsInAnyOrder(["DamageEvent"], eventNames(events));
});

test("ranged combat with 1 die if unit has moved", () => {
    let game = makeGame(new NullScenario(), diceReturning([RESULT_LIGHT]));
    let attacker = new RomanLightInfantry();
    let target = new CarthaginianHeavyInfantry();
    game.placeUnit(hexOf(1, 5), attacker);
    game.placeUnit(hexOf(1, 3), target);
    game.movementTrails.push(new MovementTrail(hexOf(1, 5)))

    game.executeCommand(new RangedCombatCommand(hexOf(1, 3), hexOf(1, 5)));

    assertDeepEquals([attacker], game.spentUnits);
});

// ranged combat from unit that moved uses 1 die

// ranged combat can make unit retreat