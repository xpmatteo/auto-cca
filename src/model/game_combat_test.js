import { hexOf } from "../lib/hexlib.js";
import { assertEquals, assertFalse, assertTrue, assertDeepEquals, assertEqualsInAnyOrder, test } from "../lib/test_lib.js";
import makeGame from "./game.js";
import * as units from "./units.js";
import { NullScenario } from "./scenarios.js";
import * as dice from "./dice.js";
import { DamageEvent, BattleBackEvent, UnitKilledEvent } from "./events.js";
import { Side } from "./side.js";
import {RetreatCommand} from "./commands/retreatCommand.js";
import {CloseCombatCommand} from "./commands/closeCombatCommand.js";

function diceReturning() {
    let invocations = 0;
    let successiveResults = Array.from(arguments);
    return {
        roll: function (count) {
            const results = successiveResults[invocations++];
            if (!results) {
                throw new Error(`Dice#roll called too many times (expected ${successiveResults.length} times)`);
            }
            if (count !== results.length) {
                throw new Error(`Expected ${results.length} rolls, got ${count}`);
            }
            return results;
        }
    }
}

function eventNames(events) {
    return events.map(e => e.constructor.name);
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
        "DamageEvent",
        "BattleBackEvent",
        "DamageEvent",
        "UnitKilledEvent",
    ];
    assertDeepEquals(expected, eventNames(actual));
    assertEquals(2, game.unitStrength(defendingUnit));
    assertTrue(game.isDead(attackingUnit));
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
        "DamageEvent",
        "UnitKilledEvent",
    ];
    assertDeepEquals(expected, eventNames(actual));
    assertFalse(game.unitAt(hexOf(1, 4)), "defending unit not on board");    
    assertDeepEquals([defendingUnit], game.killedUnitsOfSide(Side.CARTHAGINIAN));
});

test("close combat with non-ignorable flag and unblocked map NORTH", () => {
    const diceResults = [dice.RESULT_FLAG, dice.RESULT_LIGHT, dice.RESULT_LIGHT, dice.RESULT_LIGHT, dice.RESULT_LIGHT];
    const game = makeGame(new NullScenario(), diceReturning(diceResults));
    const defendingUnit = new units.CarthaginianHeavyInfantry();
    game.placeUnit(hexOf(0, 5), new units.RomanHeavyInfantry());
    game.placeUnit(hexOf(1, 4), defendingUnit);

    let actualEvents = game.executeCommand(new CloseCombatCommand(hexOf(1, 4), hexOf(0, 5)));

    // now the currentside is temporarily carthago
    assertEquals(Side.CARTHAGINIAN, game.currentSide);

    // and the possible moves are the two retreat hexes
    const expectedValidCommands = [
        new RetreatCommand(hexOf(1, 3), hexOf(1, 4)),
        new RetreatCommand(hexOf(2, 3), hexOf(1, 4)),
    ]
    assertEquals(expectedValidCommands.toString(), game.validCommands().toString());

    const expectedEvents = [
        "DamageEvent",
    ];
    assertDeepEquals(expectedEvents, eventNames(actualEvents));
});

test("close combat with non-ignorable flag and blocked path", () => {
    const diceResults = [dice.RESULT_FLAG, dice.RESULT_FLAG, dice.RESULT_HEAVY, dice.RESULT_LIGHT, dice.RESULT_LIGHT];
    const battleBackDiceResults = Array(5).fill(dice.RESULT_LIGHT);
    const game = makeGame(new NullScenario(), diceReturning(diceResults, battleBackDiceResults));
    const defendingUnit = new units.CarthaginianHeavyInfantry();
    game.placeUnit(hexOf(4, 0), defendingUnit);
    const attackingUnit = new units.RomanHeavyInfantry();
    game.placeUnit(hexOf(4, 1), attackingUnit);

    let actualEvents = game.executeCommand(new CloseCombatCommand(hexOf(4, 0), hexOf(4, 1)));

    const expectedEvents = [
        "DamageEvent",
        "BattleBackEvent",
        "DamageEvent",
    ];
    assertDeepEquals(expectedEvents, eventNames(actualEvents));
});

// retreat more than one hex

// battle back with retreat result!!!

// flag result and can retreat only partially

// unit supported, flag can be ignored

