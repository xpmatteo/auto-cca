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

test("retreat with clear ground NORTH", () => {
    const game = makeGame(new NullScenario());
    const retreatingUnit = new units.CarthaginianHeavyInfantry();
    game.placeUnit(hexOf(1, 4), retreatingUnit);
    
    assertEqualsInAnyOrder([hexOf(1,3), hexOf(2,3)], game.retreatHexes(hexOf(1, 4)));
});


test("retreat with one blocked path", () => {
    const game = makeGame(new NullScenario());
    const retreatingUnit = new units.CarthaginianHeavyInfantry();
    game.placeUnit(hexOf(1, 4), retreatingUnit);
    game.placeUnit(hexOf(1, 3), new units.CarthaginianHeavyInfantry());

    assertEqualsInAnyOrder([hexOf(2,3)], game.retreatHexes(hexOf(1, 4)));
});

test("no retreat at board limit!", () => {
    const game = makeGame(new NullScenario());
    const retreatingUnit = new units.RomanHeavyInfantry();
    game.placeUnit(hexOf(0, 8), retreatingUnit);

    assertEqualsInAnyOrder([], game.retreatHexes(hexOf(0, 8)));
});


