import { hexOf } from "../lib/hexlib.js";
import { assertDeepEquals, assertDeepEqualsObject, assertEqualsInAnyOrder, test } from "../lib/test_lib.js";
import makeGame from "./game.js";
import { NullScenario } from "./scenarios.js";
import * as units from "./units.js";
import { Side } from "./side.js";

const game = makeGame(new NullScenario());

test("retreat with clear ground NORTH 1 ", () => {
    const actual = game.retreatPaths(hexOf(4, 4), 1, Side.CARTHAGINIAN);

    const expected = {
        maxDistance: 1,
        1: [hexOf(4,3), hexOf(5,3)],
    };
    assertDeepEqualsObject(expected, actual);
});

test("retreat with clear ground SOUTH 1 ", () => {
    const actual = game.retreatPaths(hexOf(4, 4), 1, Side.ROMAN);

    const expected = {
        maxDistance: 1,
        1: [hexOf(3,5), hexOf(4,5)],
    };
    assertDeepEqualsObject(expected, actual);
});

test("retreat with clear ground NORTH 2 ", () => {
    const actual = game.retreatPaths(hexOf(4, 4), 2, Side.CARTHAGINIAN);

    const expected = {
        maxDistance: 2,
        1: [hexOf(4,3), hexOf(5,3)],
        2: [hexOf(4,2), hexOf(5,2), hexOf(6,2)],
    };
    assertDeepEqualsObject(expected, actual);
});

test("retreat with clear ground NORTH 3 ", () => {
    const actual = game.retreatPaths(hexOf(4, 4), 3, Side.CARTHAGINIAN);

    const expected = {
        maxDistance: 3,
        1: [hexOf(4,3), hexOf(5,3)],
        2: [hexOf(4,2), hexOf(5,2), hexOf(6,2)],
        3: [hexOf(4,1), hexOf(5,1), hexOf(6,1), hexOf(7,1)],
    };
    assertDeepEqualsObject(expected, actual);
});

test("retreat north impossible at board edge", () => {
    const actual = game.retreatPaths(hexOf(7, 1), 3, Side.CARTHAGINIAN);

    const expected = {
        maxDistance: 1,
        1: [hexOf(7,0), hexOf(8,0)],
        2: [],
        3: [],
    };
    assertDeepEqualsObject(expected, actual);
});

test("no retreat", () => {
    const actual = game.retreatPaths(hexOf(7, 0), 2, Side.CARTHAGINIAN);

    const expected = {
        maxDistance: 0,
        1: [],
        2: [],
    };
    assertDeepEqualsObject(expected, actual);
});

test("retreat partially blocked by units", () => {
    const game = makeGame(new NullScenario());
    game.placeUnit(hexOf(4, 3), new units.CarthaginianHeavyInfantry());
    const actual = game.retreatPaths(hexOf(4, 4), 3, Side.CARTHAGINIAN);

    const expected = {
        maxDistance: 3,
        1: [hexOf(5,3)],
        2: [hexOf(5,2), hexOf(6,2)],
        3: [hexOf(5,1), hexOf(6,1), hexOf(7,1)],
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


