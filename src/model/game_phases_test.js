import { assertEquals, test } from "../lib/test_lib.js";
import makeGame from "./game.js";
import { NullScenario } from "./scenarios.js";
import { Side } from "./side.js";



test("phase name", () => {
    const game = makeGame(new NullScenario());
    
    assertEquals(Side.ROMAN, game.currentSide);
    assertEquals("movement phase", game.currentPhaseName);

    game.endPhase();

    // assertEquals("combat phase", game.currentPhaseName);
    // assertEquals(Side.ROMAN, game.currentSide);

    // game.endPhase();

    assertEquals("movement phase", game.currentPhaseName);
    assertEquals(Side.CARTHAGINIAN, game.currentSide);

    // game.endPhase();

    // assertEquals("combat phase", game.currentPhaseName);
    // assertEquals(Side.CARTHAGINIAN, game.currentSide);
});


