
export default class MCTS {
    chooseMove(game) {
        if (game.isTerminal()) {
            return [];
        }
        return [game.validCommands()[0]];
    }
}
