import { assertEquals } from "../lib/test_lib.js";
import { EndPhaseCommand } from "../model/commands/end_phase_command.js";
import MCTS from "./mcts.js";

test('do not invoke when game is over', () => {
    const mcts = new MCTS();
    const game = {
        isTerminal: () => true,
    }

    assertEquals(undefined, mcts.chooseMove(game));
});


test('MCTS returns the only possible choice', () => {
    const mcts = new MCTS();
    const endPhaseCommand = new EndPhaseCommand();
    const game = {
        isTerminal: () => false,
        validCommands: () => [endPhaseCommand],
    }

    assertEquals(mcts.chooseMove(game), endPhaseCommand);
});
