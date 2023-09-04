// noinspection JSFileReferences

import { EndPhaseCommand } from "model/commands/end_phase_command.js";
import MCTS from "ai/mcts.js";

test('do not invoke when game is over', () => {
    const mcts = new MCTS();
    const game = {
        isTerminal: () => true,
    }

    expect(mcts.chooseMove(game)).toEqual([]);
});

test('MCTS returns the only possible choice', () => {
    const mcts = new MCTS();
    const endPhaseCommand = new EndPhaseCommand();
    const game = {
        isTerminal: () => false,
        validCommands: () => [endPhaseCommand],
    }

    expect(mcts.chooseMove(game)).toEqual([endPhaseCommand]);
});

test('MCTS expands the node', () => {
    const mcts = new MCTS();
    const command1 = new Object();
    const command2 = new Object();

    const game0 = {
        isTerminal: () => false,
        validCommands: () => [command1, command2],
        executeCommand: (command) => {
            switch (command) {
                case command1:
                    return game1;
                case command2:
                    return game2;
                default:
                    throw new Error("Unexpected command: " + command);
            }
        }
    }

    const game1 = {
        isTerminal: () => false,
    }


});
