import { ensure } from "../lib/ensure.js";
import { randomShuffleArray } from "../lib/random.js";
import { Side } from "../model/side.js";

export default class OpenLoopNode {
    #children;
    /**
     * @param {Side} side
     * @param {OpenLoopNode} parent
     * @param {number} score
     * @param {number} visits
     */
    constructor(side, parent = null, score= 0, visits= 0) {
        this.parent = parent;
        this.side = side;
        this.parent = parent;
        this.score = score;
        this.visits = visits;
        /** @type {Map<string, OpenLoopNode>} */
        this.#children = new Map();
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
            if (!this.#children.has(command.toString())) {
                const newChild = new OpenLoopNode(clone.currentSide, this);
                this.#children.set(command.toString(), newChild);
                return [clone, newChild];
            }
            const child = this.#children.get(command.toString());
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

    /**
     * @param {number} score
     * @param {Side} side
     */
    backPropagate(score, side) {
        const factor = (this.side === side) ? 1 : -1;
        this.score += factor * score;
        this.visits++;
        if (this.parent !== null) {
            this.parent.backPropagate(score, side);
        }
    }

    /**
     * @returns {Command[]}
     */
    bestCommands() {
        return undefined;
    }

    /**
     * @param {Command} command
     * @param {OpenLoopNode} child
     */
    addChild(command, child) {
        this.#children.set(command.toString(), child);
    }

    get childrenSize() {
        return this.#children.size;
    }

    /**
     * @param {Command} command
     * @returns {OpenLoopNode}
     */
    getChildNode(command) {
        return this.#children.get(command.toString());
    }
}
