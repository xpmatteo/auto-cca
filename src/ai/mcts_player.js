import { MacroMoveCommand } from "model/commands/macro_move_command.js";
import { MovementPhase } from "model/phases/MovementPhase.js";
import { randomElement, randomShuffleArray } from "../lib/random.js";
import { scoreMcts } from "./score.js";

// this is used to visualize trees with vis.js
let nextNodeId = 0;

class TreeNode {
    parent = null;
    visits = 0;
    value() {
        throw new Error("Abstract method");
    }
    /*
        This decides which is the best command for the real game
     */
    bestAbsoluteChild() {
        if (this.children.length === 0) {
            throw new Error("No children???");
        }
        let best = this.children[0];
        for (let child of this.children) {
            if (child.value() > best.value()) {
                best = child;
            }
        }
        return best;
    }

    size() {
        if (this.children.length === 0) {
            return 1;
        }
        return 1 + this.children.reduce((acc, child) => acc + child.size(), 0);
    }

    // noinspection DuplicatedCode
    shape() {
        const result = [];

        function traverse(node, level) {
            if (!result[level]) {
                result[level] = 0;
            }
            result[level]++;
            for (const child of node.children) {
                traverse(child, level + 1);
            }
        }

        traverse(this, 0);
        return result;
    }

    branchingFactor() {
        let sum = 0;
        let count = 0;
        let max = 0;

        function traverse(node) {
            if (node.children.length > 1) {
                count++;
                sum += node.children.length;
                if (node.children.length > max) {
                    max = node.children.length;
                }
            }
            for (const child of node.children) {
                traverse(child);
            }
        }

        traverse(this);
        return [sum / count, max];
    }

    /**
     * Writes the tree to a file in plain text readable by humans
     * @param {string} fileName
     */
    dumpTree(writeFunc, maxLevel=1000, minVisits = 0) {
        function traverse(node, level) {
            if (level > maxLevel || node.visits < minVisits) {
                return;
            }
            const nodeDescription = " ".repeat(level) + node.describeNode();
            writeFunc(nodeDescription)
            for (const child of node.children) {
                traverse(child, level + 1);
            }
        }
        traverse(this, 0);
    }

    toString(maxLevel = 10000, minVisits = 0) {
        let result = "";
        function append(str) {
            result += str + "\n";
        }
        this.dumpTree(append, maxLevel, minVisits);
        return result;
    }

    describeNode() {
        throw new Error("Abstract method");
    }
}

export class MacroMoveNode extends TreeNode {
    constructor(game, parent = null, score=0, visits=0, children=[], command=undefined) {
        super();
        this.id = nextNodeId++;
        this.game = game;
        this.parent = parent;
        this.score = score;
        this.visits = visits;
        this.children = children;
        this.command = command;
    }

    /**
     * Expands the node by creating all possible children
     * @returns {[TreeNode]}
     */
    expand() {
        const game = this.game;
        const validCommands = game.validCommands();
        validCommands.forEach((command) => {
        });
        const result = new DecisionNode();
        result.command = new MacroMoveCommand(validCommands);
        return [result];
    }
}

/*
 A decision node contains
   - a game state,
   - the deterministic command that produced that state
   - the cumulated score *from the point of view of the this.game.currentSide*
   - the number of visits
 */
export class DecisionNode extends TreeNode {
    constructor(game, parent = null, score=0, visits=0, children=[], command=undefined) {
        super();
        this.id = nextNodeId++;
        this.game = game;
        this.parent = parent;
        this.score = score;
        this.visits = visits;
        this.children = children;
        this.command = command;
    }

    /**
     * Expands the node by creating all possible children
     * @returns {[TreeNode]}
     */
    expand() {
        const game = this.game;
        const validCommands = game.validCommands();
        validCommands.forEach((command) => {
            if (command.isDeterministic()) {
                const clone = executeCommand(game, command);
                let childNode = undefined;
                if (clone.currentPhase instanceof MovementPhase) {
                    childNode = new MacroMoveNode(clone, this, 0, 0, [], command);
                } else {
                    childNode = new DecisionNode(clone, this, 0, 0, [], command);
                }
                this.children.push(childNode);
            } else {
                const childNode = new ChanceNode(game, this, command);
                childNode.bestUctChild(); // ensure at least one child of the chance node is created
                this.children.push(childNode);
            }
        });
        return [randomElement(this.children)];
    }

    value() {
        if (this.visits === 0) {
            return Infinity;
        }
        return this.score / this.visits;
    }

    /*
        This decides which is the most likely command to explore during tree search
     */
    bestUctChild(expansionFactor = DEFAULT_EXPANSION_FACTOR) {
        let best = undefined;
        let bestScore = -Infinity;
        randomShuffleArray(this.children);
        const logOfThisVisits = Math.log(this.visits);
        for (let child of this.children) {
            const factor = (child.game.currentSide === this.game.currentSide) ? 1 : -1;
            const ucb1 = child.value() + expansionFactor * Math.sqrt(logOfThisVisits / child.visits);
            const currentScore = factor * ucb1;
            if (currentScore > bestScore) {
                best = child;
                bestScore = currentScore;
            }
        }
        return best;
    }

    /**
     * Returns the best commands sequence for the real game, stopping after the first non-deterministic command,
     * and before the game changes side
     * @param {Side?} side
     * @returns {[Command]}
     */
    bestCommands(side) {
        if (side && this.game.currentSide !== side) {
            // stop because *after* this command, the side will change
            return [this.command];
        }
        if (this.children.length === 0) {
            return [this.command];
        }
        if (this.command && !this.command.isDeterministic()) {
            // stop because *after* this command, we don't know what the actual situation will be
            return [this.command];
        }
        let best = this.bestAbsoluteChild();
        if (this.command === undefined) {
            return best.bestCommands(side);
        }
        return [this.command].concat(best.bestCommands(side));
    }

    backPropagate(score, side) {
        const factor = (this.game.currentSide === side) ? 1 : -1;
        this.score += factor * score;
        this.visits++;
        if (this.parent !== null) {
            this.parent.backPropagate(score, side);
        }
    }

    describeNode() {
        return `${this.score.toFixed(0)}/${this.visits}: ${this.command} -> ${this.game.describeCurrentPhase()} -> ${this.children.length}`;
    }

    redundancy() {
        const nodeSet = new Set();
        function traverse(node) {
            nodeSet.add(node.game.toGame().toString());
            for (const child of node.children) {
                traverse(child);
            }
        }
        traverse(this);
        const redundancy = this.size() - nodeSet.size;
        return `${redundancy} / ${this.size()} (${(redundancy / this.size() * 100).toFixed(2)}%)})`;
    }
}

/*
 A chance node contains
   - a game state,
   - a non-deterministic command that can be applied to that state
   - a map from the possible next game states to other nodes
 */
export class ChanceNode extends TreeNode {
    constructor(game, parent, command) {
        super();
        this.id = nextNodeId++;
        this.game = game;
        this.parent = parent;
        this.command = command;
        this.visits = 0;
        this.children = [];
        this.stateToNode = new Map();
    }

    expand() {
        return [this.bestUctChild()];
    }

    value() {
        if (this.children.length === 0) {
            return Infinity;
        }
        const totalVisits = this.children.reduce((acc, child) => acc + child.visits, 0);
        if (totalVisits === 0) {
            return Infinity;
        }
        const totalScore = this.children.reduce((acc, child) => acc + child.score, 0);
        return totalScore / totalVisits;
    }

    backPropagate(score, side) {
        if (this.parent !== null) {
            this.parent.backPropagate(score, side);
        }
    }

    bestUctChild() {
        this.visits++;
        const clone = executeCommand(this.game, this.command);
        const cloneKey = clone.toString();
        if (!this.stateToNode.has(cloneKey)) {
            const child = new DecisionNode(clone, this, 0, 0, [], this.command);
            this.stateToNode.set(cloneKey, child);
            this.children.push(child);
            return child;
        }
        return this.stateToNode.get(cloneKey);
    }

    bestCommands(side) {
        return this.bestAbsoluteChild().bestCommands(side);
    }

    describeNode() {
        return `CHANCE/${this.visits}: ${this.command} -> ${this.game.describeCurrentPhase()} -> ${this.children.length}`;
    }
}

function showBestCommands(comands) {
    return "Best commands: \n - " + comands.join("\n - ") + "\nEnd best commands";
}

const DEFAULT_EXPANSION_FACTOR = 1.4142135623730951;

export class MctsPlayer {
    constructor(args = {}) {
        this.args = args;
        this.args.expansionFactor = this.args.expansionFactor || DEFAULT_EXPANSION_FACTOR;
        this.args.iterations = this.args.iterations || 1000;
        this.args.playoutIterations = this.args.playoutIterations || 20;
        this.args.logfunction = this.args.logfunction || console.log;
        this.args.note = this.args.note || "";
    }

    /**
     * @param {InteractiveGame} game
     * @returns {[Command]}
     */
    decideMove(game) {
        const startTime = Date.now();
        this.args.logfunction(" ----- AI IS THINKING -----")
        if (game.validCommands().length === 1) {
            return [game.validCommands()[0]];
        }
        const iterations = (game.currentPhase.requiresDeepThought()) ?
            this.args.iterations : 1000;
        const rootNode = this.search(game.toGame(), iterations);
        const bestCommands = rootNode.bestCommands(game.currentSide);
        this.args.logfunction(showBestCommands(rootNode.bestCommands(game.currentSide)));
        this.args.logfunction(rootNode.shape());
        this.args.logfunction(rootNode.toString(2));
        //this.args.logfunction(rootNode.redundancy());
        // this.args.logfunction(rootNode.toString(7, 10));
        this.args.logfunction("Time taken: " + (Date.now() - startTime)/1000 + "s");
        return bestCommands;
    }

    /**
     * @param {Game} game
     * @param {number} iterations
     * @returns {DecisionNode}
     */
    search(game, iterations = this.args.iterations) {
        MctsPlayer.isSearching = true;
        const rootNode = new DecisionNode(game);
        for (let i = 0; i < iterations; i++) {
            if (i % 10000 === 0) this.args.logfunction("Iteration " + i);
            this.iterate(rootNode);
        }
        MctsPlayer.isSearching = false;
        return rootNode;
    }

    iterate(rootNode) {
        let nodes = this._select(rootNode);
        nodes.forEach(node => {
            const score = this._simulate(node);
            node.backPropagate(score, node.game.currentSide);
        })
    }

    _simulate(node) {
        const clone = node.game.clone();
        for (let i = 0; i < this.args.playoutIterations && !clone.isTerminal(); i++) {
            const commands = clone.validCommands();
            const command = randomElement(commands);
            if (command)
                clone.executeCommand(command);
        }
        const number = scoreMcts(clone, node.game.currentSide);
        // return number;
        if (number === 0) {
            return 0;
        }
        if (number < 0) {
            return -1;
        }
        if (number > 0) {
            return 1;
        }
    }

    _select(node) {
        while (!node.game.isTerminal()) {
            if (node.children.length === 0) {
                return node.expand();
            } else {
                node = node.bestUctChild(this.args.expansionFactor);
            }
        }
        // node is terminal
        return [node];
    }

    toString() {
        return `MctsPlayer(${this.args.iterations}, ${this.args.playoutIterations}, ${this.args.note}))`;
    }
}

/**
 * Returns a clone of the game with the command executed, and the resulting score
 * @param {Game} game
 * @param {Command} command
 * @returns {Game}
 * @private
 */
function executeCommand(game, command) {
    const clone = game.clone();
    clone.executeCommand(command);
    return clone;
}
