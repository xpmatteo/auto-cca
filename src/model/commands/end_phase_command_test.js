import makeGame from "../game.js";
import { NullScenario } from "../scenarios.js";
import { EndPhaseCommand } from "./end_phase_command.js";

test("value of EndPhaseCommand is zero", () => {
    let game = makeGame(new NullScenario());
    let command = new EndPhaseCommand();

    expect(command.value(game)).toEqual(0);
});


