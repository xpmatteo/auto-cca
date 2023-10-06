import { AbstractCombatCommand } from "../model/commands/abstract_combat_command.js";
import { score } from "./score.js";

export class GreedyPlayer {
    /**
     * @param {Side} side
     */
    constructor(side) {
        this.side = side;
    }

    decideMove(interactiveGame) {
        const game = interactiveGame.toGame()
        if (interactiveGame.currentSide !== this.side) {
            throw new Error("Not my turn");
        }
        const commands = game.validCommands();
        if (commands.length === 0) {
            throw new Error("No valid commands");
        }
        let bestScore = -Infinity;
        let bestCommand = undefined;
        for (let command of commands) {
            const score = this.scoreCommand(game, command);
            console.log(` greedy ${this.side.name} considering ${command}\tscore: ${score}`);
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
        const number = score(gameAfterCommand, this.side);
        if (command instanceof AbstractCombatCommand) {
            return number + 10000;
        }
        return number;
    }
}
