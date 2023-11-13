import { ensure } from "../lib/ensure.js";
import { randomElement } from "../lib/random.js";
import { Side } from "../model/side.js";

export default class OpenLoopNode {
    /**
     * @param {Side} side
     * @param {number} score
     * @param {number} visits
     * @param {Map<string, [Command, OpenLoopNode]>} children
     */
    constructor(side, score= 0, visits= 0, children = new Map()) {
        this.side = side;
        this.score = score;
        this.visits = visits;
        this.children = children;
    }

    /**
     * @param {Game} game
     * @param {number} expansionFactor
     * @returns {OpenLoopNode}
     */
    bestUctChild(game, expansionFactor= 2.4142) {
        ensure(this.side === game.currentSide, "The node's side must be the same as the game's current side");
        ensure(this.visits > 0, "The node must have been visited at least once");

        if (this.children.size === 0) {
            const chosenCommand = randomElement(game.validCommands());
            game.executeCommand(chosenCommand);
            const newChild = new OpenLoopNode(game.currentSide);
            this.children.set(chosenCommand.toString(), [chosenCommand, newChild]);
            return newChild;
        }

        let bestChild = undefined;
        let bestCommand = undefined;
        let bestScore = -Infinity;
        const logOfThisVisits = Math.log(this.visits);
        for (const [key, [command, child]] of this.children) {
            // const factor = (this.side === game.currentSide) ? 1 : -1;
            const factor = 1;
            const ucb1 = child.value() + expansionFactor * Math.sqrt(logOfThisVisits / child.visits);
            const currentScore = factor * ucb1;
            if (currentScore > bestScore) {
                bestCommand = command;
                bestChild = child;
                bestScore = currentScore;
            }
        }
        game.executeCommand(bestCommand);
        return bestChild;
    }

    value() {
        return this.score / this.visits;
    }
}
