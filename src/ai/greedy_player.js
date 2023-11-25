import { randomShuffleArray } from "../lib/random.js";
import { AbstractCombatCommand } from "../model/commands/abstract_combat_command.js";
import { Command } from "../model/commands/commands.js";
import { PlayCardPhase } from "../model/phases/play_card_phase.js";
import { scoreGreedy } from "./score.js";

export class GreedyPlayer {
    constructor(cardEvaluation) {
        this.cardEvaluation = cardEvaluation;
    }

    /**
     * @param {Game} interactiveGame
     * @returns {[Command]}
     */
    decideMove(interactiveGame) {
        const game = interactiveGame.toGame();
        if (game.currentPhase instanceof PlayCardPhase) {
            return this.decideCard(game);
        }
        const commands = game.validCommands();
        randomShuffleArray(commands);
        if (commands.length === 0) {
            throw new Error("No valid commands");
        }
        let bestScore = -Infinity;
        let bestCommand = undefined;
        for (let command of commands) {
            const score = this.scoreCommand(game, command);
            // console.log(` greedy ${this.side.name} considering ${command}\tscore: ${score}`);
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
        const number = scoreGreedy(gameAfterCommand, game.currentSide);
        if (command instanceof AbstractCombatCommand) {
            return number + 10000;
        }
        return number;
    }

    toString() {
        return `GreedyPlayer`;
    }

    /**
     * @param {Game} game
     * @returns {[PlayCardCommand]}
     */
    decideCard(game) {
        let bestCommand = undefined;
        let bestScore = -Infinity;
        for (let command of game.validCommands()) {
            const score = this.cardEvaluation(game, command.card);
            if (score > bestScore) {
                bestScore = score;
                bestCommand = command;
            }
        }
        if (!bestCommand) {
            throw new Error("No valid card commands");
        }
        return [bestCommand];
    }
}
