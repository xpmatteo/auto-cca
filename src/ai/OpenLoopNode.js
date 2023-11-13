import { ensure } from "../lib/ensure.js";
import { randomShuffleArray } from "../lib/random.js";
import { Side } from "../model/side.js";

export default class OpenLoopNode {
    /**
     * @param {Side} side
     * @param {number} score
     * @param {number} visits
     * @param {Map<string, OpenLoopNode>} children
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
     * @returns {[Game, OpenLoopNode]}
     */
    bestUctChild(game, expansionFactor= 2.4142) {
        ensure(this.side === game.currentSide, "The node's side must be the same as the game's current side");
        ensure(this.visits > 0, "The node must have been visited at least once");

        let bestChild = undefined;
        let bestScore = -Infinity;
        let bestClone = undefined;
        const logOfThisVisits = Math.log(this.visits);
        for (const command of randomShuffleArray(game.validCommands())) {
            const clone = game.clone();
            clone.executeCommand(command);
            const child = this.children.get(command.toString());
            if (!child) {
                const newChild = new OpenLoopNode(clone.currentSide);
                this.children.set(command.toString(), newChild);
                return [clone, newChild];
            }
            const factor = (this.side === clone.currentSide) ? 1 : -1;
            const ucb1 = child.value() + expansionFactor * Math.sqrt(logOfThisVisits / child.visits);
            const currentScore = factor * ucb1;
            if (currentScore > bestScore) {
                bestScore = currentScore;
                bestChild = child;
                bestClone = clone;
            }
        }
        return [bestClone, bestChild];
    }

    value() {
        return this.score / this.visits;
    }
}
