
import { assertEquals, test } from "../lib/test_lib.js";
import { hexOf } from "../lib/hexlib.js";
import { MoveCommand } from "./commands.js";
import makeGame from "./game.js";
import { NullScenario } from "./scenarios.js";
import { RomanHeavyInfantry } from "./units.js";

test("MoveCommand play", () => {
    let game = makeGame(new NullScenario());     
    let command = new MoveCommand(hexOf(1,4), hexOf(1, 5));
    let unit = new RomanHeavyInfantry();
    game.placeUnit(hexOf(1, 5), unit);

    // command.play(game);

    // assertEquals(undefined, game.unitAt(hexOf(1, 5)));
    // assertEquals(unit, game.unitAt(hexOf(1, 4)));
    
});
