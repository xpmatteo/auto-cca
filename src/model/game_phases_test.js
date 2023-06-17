import { assertEquals, test, xtest } from "../lib/test_lib.js";
import makeGame from "./game.js";
import { NullScenario } from "./scenarios.js";
import * as units from "./units.js";
import { hexOf } from "../lib/hexlib.js";
import { MoveCommand } from "./commands/commands.js";


test("phase name", () => {
    const game = makeGame(new NullScenario());
        
    assertEquals("Roman movement", game.currentPhaseName);

    game.endPhase();

    assertEquals("Roman battle", game.currentPhaseName);

    game.endPhase();

    assertEquals("Carthaginian movement", game.currentPhaseName);

    game.endPhase();

    assertEquals("Carthaginian battle", game.currentPhaseName);

    game.endPhase();

    assertEquals("Roman movement", game.currentPhaseName);
});


test('clean movement phase', function () {
    const game = makeGame(new NullScenario());
    game.placeUnit(hexOf(1, 1), new units.RomanHeavyInfantry());
    game.executeCommand(new MoveCommand(hexOf(0, 1), hexOf(1, 1)));
    assertEquals(1, game.spentUnits.length, "expect one unit spent");

    game.endPhase();

    assertEquals("Roman battle", game.currentPhaseName);
    assertEquals(0, game.spentUnits.length, "spent units should be reset");
    assertEquals(1, game.movementTrails.length, "movement trails should stay");

    game.endPhase();

    assertEquals("Carthaginian movement", game.currentPhaseName);
    assertEquals(0, game.spentUnits.length, "spent units should be reset after change side");
    assertEquals(0, game.movementTrails.length, "movement trails should be reset");
});

