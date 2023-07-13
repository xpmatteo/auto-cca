import { assertDeepEquals, test } from "../../lib/test_lib.js";
import { FlagResult, handleFlags } from "./commands.js";
import { hexOf } from "../../lib/hexlib.js";

function assertHandleFlags(flags, retreatHexesPerFlag, ignorableFlags, retreatPathLength, expectedResult, message) {
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
    const actualResult = handleFlags(flags, retreatHexesPerFlag, ignorableFlags, retreatPaths);

    test(title, () => {
        assertDeepEquals(expectedResult, actualResult, message);
    });
}

let title = 'handleFlags when not ignorable and retreat is clear';
    assertHandleFlags(0, 2, 0, 0, FlagResult.NO_EFFECT, "no flags");
    assertHandleFlags(1, 1, 0, 1, FlagResult.retreat([hexOf(1, 1)]));
    assertHandleFlags(1, 2, 0, 2, FlagResult.retreat([hexOf(2, 2)]));
    assertHandleFlags(2, 2, 0, 4, FlagResult.retreat([hexOf(4, 4)]));


title = 'handleFlags when not ignorable and retreat is blocked';
    assertHandleFlags(0, 0, 0, 0, FlagResult.NO_EFFECT);
    assertHandleFlags(1, 1, 0, 0, FlagResult.damage(1));
    assertHandleFlags(1, 2, 0, 0, FlagResult.damage(2));
    assertHandleFlags(1, 2, 0, 1, new FlagResult(1, [hexOf(1, 1)]));
    assertHandleFlags(2, 2, 0, 2, new FlagResult(2, [hexOf(2, 2)]));
    assertHandleFlags(2, 2, 0, 3, new FlagResult(1, [hexOf(3, 3)]));

title = 'handleFlags when ignorable and no damage';
    assertHandleFlags(1, 1, 1, 1, FlagResult.retreat([hexOf(0, 0), hexOf(1, 1)]));
    assertHandleFlags(1, 2, 1, 2, FlagResult.retreat([hexOf(0, 0), hexOf(2, 2)]));
    assertHandleFlags(2, 1, 1, 2, FlagResult.retreat([hexOf(1, 1), hexOf(2, 2)]));
    assertHandleFlags(2, 2, 1, 4, FlagResult.retreat([hexOf(2, 2), hexOf(4, 4)]));

title = 'handleFlags when ignorable and there is or would be damage, so the flag MUST be ignored';
    // flags, ignorableFlags, retreatHexesPerFlag, retreatPathLength
    assertHandleFlags(1, 1, 1, 0, new FlagResult(0, []));
    assertHandleFlags(1, 2, 1, 1, new FlagResult(0, []));
    assertHandleFlags(2, 1, 1, 1, new FlagResult(1, [hexOf(1, 1)]));
    assertHandleFlags(3, 1, 1, 1, new FlagResult(2, [hexOf(1, 1)]));
    assertHandleFlags(3, 1, 1, 2, new FlagResult(1, [hexOf(2, 2)]));
    assertHandleFlags(2, 2, 1, 3, new FlagResult(1, [hexOf(3, 3)]));
    assertHandleFlags(2, 2, 1, 2, new FlagResult(2, [hexOf(2, 2)]));

