
export default class MCTS {
    chooseMove(game) {
        if (game.isTerminal()) {
            return undefined;
        }
        return game.validCommands()[0];
    }
}
