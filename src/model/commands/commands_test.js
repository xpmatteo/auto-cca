import { assertDeepEquals, test, xtest } from "../../lib/test_lib.js";
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
    if (!message) {
        message = `${flags} ${ignorableFlags} ${retreatHexesPerFlag} ${retreatPathLength}`;
    }
    let retreatPaths;
    switch (retreatPathLength) {
        case 0:
            retreatPaths = {
                maxDistance: 0,
                0: [hexOf(0, 0)],
            }
            break;
        case 1:
            retreatPaths = {
                maxDistance: 1,
                0: [hexOf(0, 0)],
                1: [hexOf(1, 1)],
            }
            break;
        case 2:
            retreatPaths = {
                maxDistance: 2,
                0: [hexOf(0, 0)],
                1: [hexOf(1, 1)],
                2: [hexOf(2, 2)],
            }
            break;
        case 3:
            retreatPaths = {
                maxDistance: 3,
                0: [hexOf(0, 0)],
                1: [hexOf(1, 1)],
                2: [hexOf(2, 2)],
                3: [hexOf(3, 3)],
            }
            break;
        case 4:
            retreatPaths = {
                maxDistance: 4,
                0: [hexOf(0, 0)],
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

    test(title, () => {
        assertDeepEquals(expectedResult, actualResult, message);
    });
}

let title = 'handleFlags when not ignorable and retreat is clear';
    assertHandleFlags(0, 0, 2, 0, FlagResult.NO_EFFECT, "no flags");
    assertHandleFlags(1, 0, 1, 1, FlagResult.retreat([hexOf(1,1)]));
    assertHandleFlags(1, 0, 2, 2, FlagResult.retreat([hexOf(2,2)]));
    assertHandleFlags(2, 0, 2, 4, FlagResult.retreat([hexOf(4,4)]));


title = 'handleFlags when not ignorable and retreat is blocked';
    assertHandleFlags(0, 0, 0, 0, FlagResult.NO_EFFECT);
    assertHandleFlags(1, 0, 1, 0, FlagResult.damage(1));
    assertHandleFlags(1, 0, 2, 0, FlagResult.damage(2));
    assertHandleFlags(1, 0, 2, 1, new FlagResult(1, [hexOf(1,1)]));
    assertHandleFlags(2, 0, 2, 2, new FlagResult(2, [hexOf(2,2)]));
    assertHandleFlags(2, 0, 2, 3, new FlagResult(1, [hexOf(3,3)]));

title = 'handleFlags when ignorable and no damage';
    assertHandleFlags(1, 1, 1, 1, FlagResult.retreat([hexOf(0,0), hexOf(1,1)]));
    assertHandleFlags(1, 1, 2, 2, FlagResult.retreat([hexOf(0,0), hexOf(2,2)]));
    assertHandleFlags(2, 1, 1, 2, FlagResult.retreat([hexOf(1,1), hexOf(2,2)]));
    assertHandleFlags(2, 1, 2, 4, FlagResult.retreat([hexOf(2,2), hexOf(4,4)]));

title = 'handleFlags when ignorable and there is or would be damage, so the flag MUST be ignored';
    // flags, ignorableFlags, retreatHexesPerFlag, retreatPathLength
    assertHandleFlags(1, 1, 1, 0, new FlagResult(0, []));
    assertHandleFlags(1, 1, 2, 1, new FlagResult(0, []));
    assertHandleFlags(2, 1, 1, 1, new FlagResult(1, [hexOf(1,1)]));
    assertHandleFlags(3, 1, 1, 1, new FlagResult(2, [hexOf(1,1)]));
    assertHandleFlags(3, 1, 1, 2, new FlagResult(1, [hexOf(2,2)]));
    assertHandleFlags(2, 1, 2, 3, new FlagResult(1, [hexOf(3,3)]));
    assertHandleFlags(2, 1, 2, 2, new FlagResult(2, [hexOf(2,2)]));

