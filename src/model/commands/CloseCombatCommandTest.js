import {assertDeepEquals, assertEquals, test} from "../../lib/test_lib.js";
import makeGame from "../game.js";
import {NullScenario} from "../scenarios.js";
import {CarthaginianHeavyInfantry, RomanHeavyInfantry} from "../units.js";
import {hexOf} from "../../lib/hexlib.js";
import {CloseCombatCommand} from "./closeCombatCommand.js";
import {Side} from "../side.js";

test("CloseCombatCommand play", () => {
    let game = makeGame(new NullScenario());
    let unit = new RomanHeavyInfantry();
    let target = new CarthaginianHeavyInfantry();
    game.placeUnit(hexOf(1, 5), unit);
    game.placeUnit(hexOf(1, 4), target);

    game.executeCommand(new CloseCombatCommand(hexOf(1,4), hexOf(1, 5)));

    assertDeepEquals([unit], game.spentUnits);
});


test("value of CloseCombatCommand", () => {
    let game = makeGame(new NullScenario());
    let attacker = new RomanHeavyInfantry();
    let defender = new CarthaginianHeavyInfantry();
    game.placeUnit(hexOf(1, 5), attacker);
    game.placeUnit(hexOf(1, 4), defender);
    let command = new CloseCombatCommand(hexOf(1, 4), hexOf(1, 5));
    assertEquals(Side.ROMAN, game.currentSide)

    // value is 1000 / defender strength
    assertEquals(250, command.value(game));
});
