import { assertEquals, test } from "../lib/test_lib.js";
import * as GameStatus from "./game_status.js";
import { ScenarioRaceToOppositeSide } from "./scenarios.js";
import { Cca } from "./game.js";

test("game status", () => {
    const scenario = new ScenarioRaceToOppositeSide();
    const cca = new Cca(scenario);

    assertEquals(GameStatus.ONGOING, cca.gameStatus(cca.state));
});

//test("validCommands", () => {
