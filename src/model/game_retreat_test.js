import { hexOf } from "../lib/hexlib.js";
import { assertDeepEquals, assertDeepEqualsObject, assertEqualsInAnyOrder, test } from "../lib/test_lib.js";
import makeGame from "./game.js";
import { NullScenario } from "./scenarios.js";
import * as units from "./units.js";
import { Side } from "./side.js";

test("retreat with clear ground NORTH 1 ", () => {
    const game = makeGame(new NullScenario());

    const actual = game.retreatPaths(hexOf(4, 4), 1, Side.CARTHAGINIAN);

    assertDeepEqualsObject({1: [hexOf(4,3), hexOf(5,3)]}, actual);
});

test("retreat with clear ground SOUTH 1 ", () => {
    const game = makeGame(new NullScenario());

    const actual = game.retreatPaths(hexOf(4, 4), 1, Side.ROMAN);

    assertDeepEqualsObject({1: [hexOf(3,5), hexOf(4,5)]}, actual);
});

test("retreat with clear ground NORTH 2 ", () => {
    const game = makeGame(new NullScenario());

    const actual = game.retreatPaths(hexOf(4, 4), 2, Side.CARTHAGINIAN);

    const expected = {
        1: [hexOf(4,3), hexOf(5,3)],
        2: [hexOf(4,2), hexOf(5,2), hexOf(6,2)],
    };
    assertDeepEqualsObject(expected, actual);
});

test("retreat with clear ground NORTH 3 ", () => {
    const game = makeGame(new NullScenario());

    const actual = game.retreatPaths(hexOf(4, 4), 2, Side.CARTHAGINIAN);

    const expected = {
        1: [hexOf(4,3), hexOf(5,3)],
        2: [hexOf(4,2), hexOf(5,2), hexOf(6,2)],
        3: [hexOf(4,1), hexOf(5,1), hexOf(6,1), hexOf(7,1)],
    };
    assertDeepEqualsObject(expected, actual);
});


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


