import {assertDeepEquals, assertEquals, test} from "../../lib/test_lib.js";
import makeGame, {MovementTrail} from "../game.js";
import {NullScenario} from "../scenarios.js";
import {CarthaginianHeavyInfantry} from "../units.js";
import {hexOf} from "../../lib/hexlib.js";
import {RetreatPhase} from "./RetreatPhase.js";
import {Side} from "../side.js";
import {RetreatCommand} from "../commands/retreatCommand.js";
import { BattlePhase } from "./BattlePhase.js";


test("Retreat play", () => {
    let game = makeGame(new NullScenario());
    let unit = new CarthaginianHeavyInfantry();
    game.placeUnit(hexOf(1, 5), unit);
    game.phases = [new RetreatPhase(Side.CARTHAGINIAN, hexOf(1,5), [hexOf(1,4)]), new BattlePhase()]

    game.executeCommand(new RetreatCommand(hexOf(1,4), hexOf(1, 5)));

    assertEquals("Roman battle", game.currentPhaseName);
    assertEquals(undefined, game.unitAt(hexOf(1, 5)));
    assertEquals(unit, game.unitAt(hexOf(1, 4)));
    assertDeepEquals([new MovementTrail(hexOf(1, 4), hexOf(1, 5))], game.movementTrails);
});

