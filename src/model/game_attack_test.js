import { hexOf } from "../lib/hexlib.js";
import { assertEquals, assertFalse, assertTrue, assertDeepEquals, test } from "../lib/test_lib.js";
import makeGame from "./game.js";
import * as units from "./units.js";
import { CloseCombatCommand } from "./commands.js";
import { NullScenario } from "./scenarios.js";
import * as dice from "./dice.js";
import { DamageEvent, BattleBackEvent, UnitKilledEvent } from "./events.js";
import { Side } from "./side.js";

function diceReturning() {
    let invocations = 0;
    let successiveResults = Array.from(arguments);
    return {
        roll: function (count) {
            const results = successiveResults[invocations++];
            if (count !== results.length) {
                throw new Error(`Expected ${results.length} rolls, got ${count}`);
            }
            return results;
        }
    }
}

test("execute Attack then battle back", () => {
    const attackDice = 
        [dice.RESULT_HEAVY, dice.RESULT_SWORDS, dice.RESULT_MEDIUM, dice.RESULT_LIGHT, dice.RESULT_LIGHT];
    const battleBackDice = Array(5).fill(dice.RESULT_HEAVY);
    const game = makeGame(new NullScenario(), diceReturning(attackDice, battleBackDice));
    const defendingUnit = new units.CarthaginianHeavyInfantry();
    const attackingUnit = new units.RomanHeavyInfantry();
    game.placeUnit(hexOf(1, 5), attackingUnit);
    game.placeUnit(hexOf(1, 4), defendingUnit);

    let actual = game.executeCommand(new CloseCombatCommand(hexOf(1, 4), hexOf(1, 5)));

    const expected = [
        new DamageEvent(hexOf(1, 4), 2, attackDice),
        new BattleBackEvent(hexOf(1, 5), hexOf(1, 4), 5),
        new DamageEvent(hexOf(1, 5), 5, battleBackDice),
        new UnitKilledEvent(hexOf(1, 5), attackingUnit),
    ];
    assertDeepEquals(expected.toString(), actual.toString());
    assertEquals(2, defendingUnit.strength);
    assertTrue(attackingUnit.isDead());
});

// attack then killed
test("execute Attack and kill defender", () => {
    const diceResults = Array(5).fill(dice.RESULT_HEAVY);
    const game = makeGame(new NullScenario(), diceReturning(diceResults));
    const defendingUnit = new units.CarthaginianHeavyInfantry();
    game.placeUnit(hexOf(1, 5), new units.RomanHeavyInfantry());
    game.placeUnit(hexOf(1, 4), defendingUnit);

    let actual = game.executeCommand(new CloseCombatCommand(hexOf(1, 4), hexOf(1, 5)));

    const expected = [
        new DamageEvent(hexOf(1, 4), 5, diceResults),
        new UnitKilledEvent(hexOf(1, 4), defendingUnit),
    ];
    assertEquals(expected.toString(), actual.toString());
    assertFalse(game.unitAt(hexOf(1, 4)), "defending unit not on board");    
    assertDeepEquals([defendingUnit], game.graveyard.unitsOf(Side.CARTHAGINIAN));
});

// flag result and cannot retreat

// flag result and can retreat

// attack and no damage

// unit supported, flag can be ignored