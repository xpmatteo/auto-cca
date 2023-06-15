import { hexOf } from "../lib/hexlib.js";
import { assertEquals, assertFalse, assertTrue, assertDeepEquals, assertEqualsInAnyOrder, test } from "../lib/test_lib.js";
import makeGame from "./game.js";
import * as units from "./units.js";
import { MoveCommand, CloseCombatCommand } from "./commands.js";
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
        new MoveCommand(hexOf(1, 3), hexOf(1, 4)),
        new MoveCommand(hexOf(2, 3), hexOf(1, 4)),
    ]
    assertEqualsInAnyOrder(expectedValidCommands, game.validCommands());

    const expectedEvents = [
        new DamageEvent(hexOf(1, 4), 0, diceResults),
    ];
    assertEquals(expectedEvents.toString(), actualEvents.toString());
});


// at the end of retreat, the retreat phase is automatically removed


test("close combat with non-ignorable flag and unblocked map SOUTH", () => {
    const diceResults = [dice.RESULT_FLAG, dice.RESULT_LIGHT, dice.RESULT_LIGHT, dice.RESULT_LIGHT, dice.RESULT_LIGHT];
    const game = makeGame(new NullScenario(), diceReturning(diceResults));
    const defendingUnit = new units.RomanHeavyInfantry();
    const attackingUnit = new units.CarthaginianHeavyInfantry();
    game.placeUnit(hexOf(1, 4), attackingUnit);
    game.placeUnit(hexOf(0, 5), defendingUnit);

    let actualEvents = game.executeCommand(new CloseCombatCommand(hexOf(0, 5), hexOf(1, 4)));

    // now the currentside is temporarily Roman
    assertEquals(Side.ROMAN, game.currentSide);

    // and the possible moves are the two retreat hexes
    const expectedValidCommands = [
        new MoveCommand(hexOf(-1, 6), hexOf(0, 5)),
        new MoveCommand(hexOf(0, 6), hexOf(0, 5)),
    ]
    assertEqualsInAnyOrder(expectedValidCommands, game.validCommands());

    const expectedEvents = [
        new DamageEvent(hexOf(0, 5), 0, diceResults),
    ];
    assertEquals(expectedEvents.toString(), actualEvents.toString());
});

// close combat with non-ignorable flag and unblocked map SOUTH

// battle back with retreat result!!!

// flag result and cannot retreat

// flag result and can retreat only partially

// unit supported, flag can be ignored
