import { assertEquals, test, xtest } from "../lib/test_lib.js";
import * as GameStatus from "./game_status.js";
import { ScenarioRaceToOppositeSide } from "./scenarios.js";
import { Cca } from "./game.js";

test("game status", () => {
    const scenario = new ScenarioRaceToOppositeSide();
    const cca = new Cca(scenario);

    assertEquals(GameStatus.ONGOING, cca.gameStatus(cca.state));
});


xtest("validCommands", () => {
    const scenario = new ScenarioRaceToOppositeSide();
    const cca = new Cca(scenario);

    let validCommands = cca.validCommands(cca.state);
    console.log(validCommands);

    assertEquals(6, validCommands.length);
});
