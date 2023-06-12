import { hexOf } from "../lib/hexlib.js";
import { assertEquals, assertFalse, assertTrue, assertDeepEquals, test } from "../lib/test_lib.js";
import makeGame from "./game.js";
import * as units from "./units.js";
import { CloseCombatCommand } from "./commands.js";
import { NullScenario } from "./scenarios.js";
import * as dice from "./dice.js";
import { DamageEvent, BattleBackEvent, UnitKilledEvent } from "./events.js";
import { Side } from "./side.js";

function diceReturning(results) {
    return {
        roll: function (count) {
            if (count !== results.length) {
                throw new Error(`Expected ${results.length} rolls, got ${count}`);
            }
            return results;
        }
    }
}

test("execute Attack then battle back", () => {
    const diceResults = 
        [dice.RESULT_HEAVY, dice.RESULT_SWORDS, dice.RESULT_MEDIUM, dice.RESULT_LIGHT, dice.RESULT_LIGHT];
    const game = makeGame(new NullScenario(), diceReturning(diceResults));
    const defendingUnit = new units.CarthaginianHeavyInfantry();
    game.placeUnit(hexOf(1, 5), new units.RomanHeavyInfantry());
    game.placeUnit(hexOf(1, 4), defendingUnit);

    let actual = game.executeCommand(new CloseCombatCommand(hexOf(1, 4), hexOf(1, 5)));

    const expected = [
        new DamageEvent(hexOf(1, 4), 2, diceResults),
        // new BattleBackEvent(hexOf(1, 5), hexOf(1, 4), 5)
    ];
    assertDeepEquals(expected, actual);
    assertEquals(2, defendingUnit.strength);
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
    assertDeepEquals(expected, actual);
    assertFalse(game.unitAt(hexOf(1, 4)), "defending unit not on board");    
    assertDeepEquals([defendingUnit], game.graveyard.unitsOf(Side.CARTHAGINIAN));
});

// flag result and cannot retreat

// flag result and can retreat

// attack and no damage

// unit supported, flag can be ignored