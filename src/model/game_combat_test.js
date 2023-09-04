import { hexOf } from "../lib/hexlib.js";
import makeGame from "./game.js";
import * as units from "./units.js";
import { NullScenario } from "./scenarios.js";
import * as dice from "./dice.js";
import { BattleBackEvent, DamageEvent, UnitKilledEvent } from "./events.js";
import { Side } from "./side.js";
import { RetreatCommand } from "./commands/retreatCommand.js";
import { CloseCombatCommand } from "./commands/close_combat_command.js";

export function diceReturning() {
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

export function eventNames(events) {
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
    expect(eventNames(actual)).toEqual(expected);
    expect(game.unitStrength(defendingUnit)).toEqual(2);
    expect(game.isUnitDead(attackingUnit)).toBe(true);
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
    expect(eventNames(actual)).toEqual(expected);
    expect(game.unitAt(hexOf(1, 4))).toBeUndefined();
    expect(game.killedUnitsOfSide(Side.CARTHAGINIAN)).toEqual([defendingUnit]);
});

test("close combat with non-ignorable flag and unblocked map NORTH", () => {
    const diceResults = [dice.RESULT_FLAG, dice.RESULT_LIGHT, dice.RESULT_LIGHT, dice.RESULT_LIGHT, dice.RESULT_LIGHT];
    const game = makeGame(new NullScenario(), diceReturning(diceResults));
    const defendingUnit = new units.CarthaginianHeavyInfantry();
    game.placeUnit(hexOf(0, 5), new units.RomanHeavyInfantry());
    game.placeUnit(hexOf(1, 4), defendingUnit);

    let actualEvents = game.executeCommand(new CloseCombatCommand(hexOf(1, 4), hexOf(0, 5)));

    // now the currentside is temporarily carthago
    expect(game.currentSide).toEqual(Side.CARTHAGINIAN);

    // and the possible moves are the two retreat hexes
    const expectedValidCommands = [
        new RetreatCommand(hexOf(1, 3), hexOf(1, 4)),
        new RetreatCommand(hexOf(2, 3), hexOf(1, 4)),
    ]
    expect(game.validCommands().toString()).toEqual(expectedValidCommands.toString());

    const expectedEvents = [
        "DamageEvent",
    ];
    expect(eventNames(actualEvents)).toEqual(expectedEvents);
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
    expect(eventNames(actualEvents)).toEqual(expectedEvents);
    expect(game.unitStrength(defendingUnit)).toEqual(1); // two damage from flags, one from HEAVY result
});

test("close combat with ignorable flag and blocked map NORTH", () => {
    const diceResults = [dice.RESULT_FLAG, dice.RESULT_FLAG, dice.RESULT_HEAVY, dice.RESULT_LIGHT, dice.RESULT_LIGHT];
    const battleBackDiceResults = Array(5).fill(dice.RESULT_LIGHT); // no damage from battle back
    const game = makeGame(new NullScenario(), diceReturning(diceResults, battleBackDiceResults));
    const defendingUnit = new units.CarthaginianHeavyInfantry();
    game.placeUnit(hexOf(3, 0), new units.CarthaginianLightInfantry());
    game.placeUnit(hexOf(4, 0), defendingUnit);
    game.placeUnit(hexOf(5, 0), new units.CarthaginianLightInfantry());
    const attackingUnit = new units.RomanHeavyInfantry();
    game.placeUnit(hexOf(4, 1), attackingUnit);

    let actualEvents = game.executeCommand(new CloseCombatCommand(hexOf(4, 0), hexOf(4, 1)));

    const expectedEvents = [
        "DamageEvent",
        "BattleBackEvent",
        "DamageEvent",
    ];
    expect(eventNames(actualEvents)).toEqual(expectedEvents);
    expect(game.unitStrength(defendingUnit)).toEqual(2);  // one damage from flag, one from HEAVY result
    expect(game.unitStrength(attackingUnit)).toEqual(4);  // no damage from battle back
});



