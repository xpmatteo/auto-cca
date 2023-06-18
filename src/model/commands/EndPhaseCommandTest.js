import {assertEquals, test} from "../../lib/test_lib.js";
import makeGame from "../game.js";
import {NullScenario} from "../scenarios.js";
import {EndPhaseCommand} from "./endPhaseCommand.js";

test("value of EndPhaseCommand is zero", () => {
    let game = makeGame(new NullScenario());
    let command = new EndPhaseCommand();

    assertEquals(0, command.value(game));
});


