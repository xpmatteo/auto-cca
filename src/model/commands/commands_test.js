import { assertDeepEquals, test } from "../../lib/test_lib.js";
import { RESULT_FLAG } from "../dice.js";
import { FlagResult, handleFlags } from "./commands.js";
import { hexOf } from "../../lib/hexlib.js";

/*
    handleFlags(results, game)

    Flags       Ignorable   RetreatPathLength    Result
    0           any         any                  no effect
    1           no          1+                   retreat 1
    2           no          2+                   retreat 2
    1           yes         0                    no effect
    2           yes         0                    damage 1
*/

function assertHandleFlags(flags, ignorableFlags, retreatHexesPerFlag, retreatPathLength, expectedResult, message) {
    let retreatPaths;
    switch (retreatPathLength) {
        case 0:
            retreatPaths = {
                maxDistance: 0
            }
            break;
        case 1:
            retreatPaths = {
                maxDistance: 1,
                1: [hexOf(1, 1)],
            }
            break;
        case 2:
            retreatPaths = {
                maxDistance: 2,
                1: [hexOf(1, 1)],
                2: [hexOf(2, 2)],
            }
            break;
        case 3:
            retreatPaths = {
                maxDistance: 3,
                1: [hexOf(1, 1)],
                2: [hexOf(2, 2)],
                3: [hexOf(3, 3)],
            }
            break;
        case 4:
            retreatPaths = {
                maxDistance: 4,
                1: [hexOf(1, 1)],
                2: [hexOf(2, 2)],
                3: [hexOf(3, 3)],
                4: [hexOf(4, 4)],
            }
            break;
        default:
            throw new Error("unsupported retreatPathLength: " + retreatPathLength);
    }
    const actualResult = handleFlags(Array(flags).fill(RESULT_FLAG), retreatHexesPerFlag, ignorableFlags, retreatPaths);

    assertDeepEquals(expectedResult, actualResult, message);
}

test('handleFlags when not ignorable and retreat is clear', () => {
    assertHandleFlags(0, 0, 2, 0, FlagResult.NO_EFFECT, "no flags");
    assertHandleFlags(1, 0, 1, 1, FlagResult.retreat([hexOf(1,1)]), "retreat 1 flag 1 hex");
    assertHandleFlags(1, 0, 2, 2, FlagResult.retreat([hexOf(2,2)]), "retreat 1 flag 2 hexes");
    assertHandleFlags(2, 0, 2, 4, FlagResult.retreat([hexOf(4,4)]), "retreat 2 flag 2 hexes");
});

test('handleFlags when not ignorable and retreat is blocked', () => {
    assertHandleFlags(0, 0, 0, 0, FlagResult.NO_EFFECT, "no flags");
    assertHandleFlags(1, 0, 1, 0, FlagResult.damage(1), "retreat 1 flag x 1 blocked");
    assertHandleFlags(1, 0, 2, 0, FlagResult.damage(2), "retreat 1 flag x 2 blocked");
    assertHandleFlags(1, 0, 2, 1, new FlagResult(1, [hexOf(1,1)]), "retreat 1 flag x 2 partially blocked");
    assertHandleFlags(2, 0, 2, 2, new FlagResult(2, [hexOf(2,2)]), "retreat 1 flag x 2 partially blocked");
    assertHandleFlags(2, 0, 2, 3, new FlagResult(1, [hexOf(3,3)]), "retreat 1 flag x 2 partially blocked");
});


test('handleFlags', () => {

    // assertHandleFlags(0, 0, 0, FlagResult.NO_EFFECT, "no flags");
    // assertHandleFlags(1,   0, 1, FlagResult.retreat(1), "retret 1");
    // assertHandleFlags(2, 0, 2, FlagResult.retreat(2), "retret 2");
    //
    // assertHandleFlags(1,              0, 0, FlagResult.damage(1), "damage 1");
    // assertHandleFlags(2, 0, 0, FlagResult.damage(2), "damage 2");
    //
    // assertHandleFlags(1,              1, 0, FlagResult.NO_EFFECT, "ignored 1 flag");
    // assertHandleFlags(2, 1, 0, FlagResult.damage(1), "ignored 1 flag, damage 1");
});
