import { ensure, ensureDefined } from "../lib/ensure.js";
import { randomShuffleArray } from "../lib/random.js";
import { Side } from "../model/side.js";

export default class OpenLoopNode {
    /** @type {Map<string, [Command,OpenLoopNode]>} */
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
        this.#children = new Map();
    }

    /**
     * @param {Game} game
     * @param {number} expansionFactor
     * @returns {[Game, OpenLoopNode]}
     */
    bestUctChild(game, expansionFactor= 2.4142) {
        ensure(this.side === game.currentSide, `The node's side ${this.side} must be the same as the game's current side ${game.currentSide}}`);

        let bestChild = undefined;
        let bestScore = -Infinity;
        let bestClone = undefined;
        const logOfThisVisits = this.visits === 0 ? 0 : Math.log(this.visits);
        for (const command of randomShuffleArray(game.validCommands())) {
            const clone = game.clone();
            clone.executeCommand(command);
            if (!this.#children.has(command.toString())) {
                const newChild = new OpenLoopNode(clone.currentSide, this);
                this.addChild(command, newChild);
                return [clone, newChild];
            }
            const child = this.getChildNode(command.toString());
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
        This decides which is the best command for the real game
       @returns {[Command, OpenLoopNode]}
    */
    bestAbsoluteChild() {
        if (this.childrenSize === 0) {
            throw new Error("No children???");
        }
        let best = undefined;
        let bestValue = -Infinity;
        for (let [__, [command, child]] of this.#children) {
            if (child.value() > bestValue) {
                best = [command, child];
                bestValue = child.value();
            }
        }
        return best;
    }

    /**
     * Returns the best commands sequence for the real game, stopping after the first non-deterministic command,
     * and before the game changes side
     * @param {Side?} side
     * @returns {Command[]}
     */
    bestCommands(side= undefined) {
        if (side && this.side !== side) {
            // stop because *after* this command, the side will change
            return [];
        }
        if (this.childrenSize === 0) {
            return [];
        }
        const [bestCommand, bestChild] = this.bestAbsoluteChild();
        if (!bestCommand.isDeterministic()) {
            // stop because *after* this command, we don't know what the actual situation will be
            return [bestCommand];
        } else {
            return [bestCommand].concat(bestChild.bestCommands(side));
        }
    }

    /**
     * @param {Command} command
     * @param {OpenLoopNode} child
     */
    addChild(command, child) {
        this.#children.set(command.toString(), [command, child]);
    }

    get childrenSize() {
        return this.#children.size;
    }

    get children() {
        return this.#children.values();
    }

    /**
     * @param {Command} command
     * @returns {OpenLoopNode}
     */
    getChildNode(command) {
        if (!this.#children.has(command.toString())) {
            return undefined;
        }
        return this.#children.get(command.toString())[1];
    }

    size() {
        if (this.childrenSize === 0) {
            return 1;
        }
        return 1 + this.#children.values().reduce((acc, [__, child]) => acc + child.size(), 0);
    }

    shape() {
        const result = [];

        /**
         * @param {OpenLoopNode} node
         * @param {number} level
         */
        function traverse(node, level) {
            if (!result[level]) {
                result[level] = 0;
            }
            result[level]++;
            for (const [__, child] of node.children) {
                traverse(child, level + 1);
            }
        }

        traverse(this, 0);
        return result;
    }

    /**
     * Writes the tree in plain text
     * @param {(string)=>void} writeFunc
     * @param {number} maxLevel
     * @param {number} minVisits
     */
    dumpTree(writeFunc, maxLevel=1000, minVisits = 0) {
        /**
         * @param {Command} command
         * @param {OpenLoopNode} node
         * @param {number} level
         */
        function traverse(command, node, level) {
            if (level > maxLevel || node.visits < minVisits) {
                return;
            }
            const nodeDescription = " ".repeat(level) + `${command} -> ${node.describeNode()}`;
            writeFunc(nodeDescription)
            for (const [__, [command, child]] of node.#children) {
                traverse(command, child, level + 1);
            }
        }
        traverse(undefined, this, 0);
    }

    toString(maxLevel = 10000, minVisits = 0) {
        let result = "";

        /** @param {string} str */
        function append(str) {
            result += str + "\n";
        }
        this.dumpTree(append, maxLevel, minVisits);
        return result;
    }

    describeNode() {
        return `${this.score.toFixed(0)}/${this.visits}: ${this.side} -> ${this.childrenSize}`;
    }
}
