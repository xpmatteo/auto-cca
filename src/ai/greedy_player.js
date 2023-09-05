import { score } from "./score.js";

export class GreedyPlayer {
    decideMove(interactiveGame) {
        const game = interactiveGame.toGame()
        const commands = game.validCommands();
        if (commands.length === 0) {
            throw new Error("No valid commands");
        }
        let bestScore = -Infinity;
        let bestCommand = undefined;
        for (let command of commands) {
            const score = this.scoreCommand(game, command);
            if (score > bestScore) {
                bestScore = score;
                bestCommand = command;
            }
        }
        return [bestCommand];
    }

    scoreCommand(game, command) {
        const gameAfterCommand = game.clone();
        gameAfterCommand.executeCommand(command);
        return score(gameAfterCommand, gameAfterCommand.currentSide);
    }
}
