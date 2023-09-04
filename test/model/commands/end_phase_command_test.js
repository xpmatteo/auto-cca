import makeGame from "model/game.js";
import { NullScenario } from "model/scenarios.js";
import { EndPhaseCommand } from "model/commands/end_phase_command.js";

test("value of EndPhaseCommand is zero", () => {
    let game = makeGame(new NullScenario());
    let command = new EndPhaseCommand();

    expect(command.value(game)).toEqual(0);
});


