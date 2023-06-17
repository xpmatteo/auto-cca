import { hexOf } from "../lib/hexlib.js";
import { assertEqualsInAnyOrder, test } from "../lib/test_lib.js";
import makeGame from "./game.js";
import { NullScenario } from "./scenarios.js";
import * as units from "./units.js";


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


