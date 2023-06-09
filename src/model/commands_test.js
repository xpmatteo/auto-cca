
import { assertEquals, assertDeepEquals, test } from "../lib/test_lib.js";
import { hexOf } from "../lib/hexlib.js";
import { CloseCombatCommand, MoveCommand } from "./commands.js";
import makeGame from "./game.js";
import { NullScenario } from "./scenarios.js";
import { CarthaginianHeavyInfantry, RomanHeavyInfantry } from "./units.js";
import { MovementTrail } from "./turn.js";

test("MoveCommand play", () => {
    let game = makeGame(new NullScenario());     
    let unit = new RomanHeavyInfantry();
    game.placeUnit(hexOf(1, 5), unit);

    game.executeCommand(new MoveCommand(hexOf(1,4), hexOf(1, 5)));

    assertEquals(undefined, game.unitAt(hexOf(1, 5)));
    assertEquals(unit, game.unitAt(hexOf(1, 4)));
    assertDeepEquals([unit], game.spentUnits);
    assertDeepEquals([new MovementTrail(hexOf(1, 4), hexOf(1, 5))], game.movementTrails);
});


test("CloseCombatCommand play", () => {
    let game = makeGame(new NullScenario());     
    let unit = new RomanHeavyInfantry();
    let target = new CarthaginianHeavyInfantry();
    game.placeUnit(hexOf(1, 5), unit);
    game.placeUnit(hexOf(1, 4), target);

    game.executeCommand(new CloseCombatCommand(hexOf(1,4), hexOf(1, 5)));

    assertDeepEquals([unit], game.spentUnits);
});
