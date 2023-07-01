
import { assertDeepEquals, test } from "../../lib/test_lib.js";
import makeGame from "../game.js";
import { NullScenario } from "../scenarios.js";
import { diceReturning } from "../game_combat_test.js";
import { RESULT_FLAG, RESULT_SWORDS } from "../dice.js";
import { CarthaginianHeavyInfantry, RomanLightInfantry } from "../units.js";
import { hexOf } from "../../lib/hexlib.js";
import { RangedCombatCommand } from "./ranged_combat_command.js";
import { FlagResult, handleFlags } from "./commands.js";


/*
    handleFlags(results, game)

    Flags       Ignorable   RetreatPathLength    Result
    0           any         any                  no effect
    1           no          1+                   retreat 1
    2           no          2+                   retreat 2
    1           yes         0                    no effect
    2           yes         0                    damage 1

 */


function assertHandleFlags(diceResults, ignorableFlags, retreatPathLength, expectedResult, message) {
    const actualResult = handleFlags(diceResults, ignorableFlags, retreatPathLength);

    assertDeepEquals(expectedResult, actualResult, message);
}

test('handleFlags', () => {

    assertHandleFlags([RESULT_SWORDS], 0, 0, FlagResult.NO_EFFECT, "no flags");
    assertHandleFlags([RESULT_FLAG],   0, 1, FlagResult.retreat(1), "retret 1");
    assertHandleFlags([RESULT_FLAG, RESULT_FLAG], 0, 2, FlagResult.retreat(2), "retret 2");

    assertHandleFlags([RESULT_FLAG],              0, 0, FlagResult.damage(1), "damage 1");
    assertHandleFlags([RESULT_FLAG, RESULT_FLAG], 0, 0, FlagResult.damage(2), "damage 2");

    assertHandleFlags([RESULT_FLAG],              1, 0, FlagResult.NO_EFFECT, "ignored 1 flag");
    assertHandleFlags([RESULT_FLAG, RESULT_FLAG], 1, 0, FlagResult.damage(1), "ignored 1 flag, damage 1");
});
