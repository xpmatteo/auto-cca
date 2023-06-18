import {assertDeepEquals, assertEquals, test} from "../../lib/test_lib.js";
import makeGame, {MovementTrail} from "../game.js";
import {NullScenario} from "../scenarios.js";
import {CarthaginianHeavyInfantry} from "../units.js";
import {hexOf} from "../../lib/hexlib.js";
import {RetreatPhase} from "./RetreatPhase.js";
import {Side} from "../side.js";
import {RetreatCommand} from "../commands/retreatCommand.js";


test("Retreat play", () => {
    let game = makeGame(new NullScenario());
    let unit = new CarthaginianHeavyInfantry();
    game.placeUnit(hexOf(1, 5), unit);
    assertEquals("Roman movement", game.currentPhaseName);
    game.unshiftPhase(new RetreatPhase(Side.CARTHAGINIAN, hexOf(1,5), [hexOf(1,4)]))
    assertEquals("Carthaginian retreat", game.currentPhaseName);

    game.executeCommand(new RetreatCommand(hexOf(1,4), hexOf(1, 5)));

    assertEquals("Roman movement", game.currentPhaseName);
    assertEquals(undefined, game.unitAt(hexOf(1, 5)));
    assertEquals(unit, game.unitAt(hexOf(1, 4)));
    assertDeepEquals([new MovementTrail(hexOf(1, 4), hexOf(1, 5))], game.movementTrails);
});

