import { scoreMcts } from "./score.js";

// this is used to visualize trees with vis.js
let nextNodeId = 0;

/*
 A decision node contains
   - a game state,
   - the deterministic command that produced that state
   - the cumulated score *from the point of view of the this.game.currentSide*
   - the number of visits
 */
export class DecisionNode {
    constructor(game, parent = null, score=0, visits=0, children=[], command=undefined) {
        this.id = nextNodeId++;
        this.game = game;
        this.parent = parent;
        this.score = score;
        this.visits = visits;
        this.children = children;
        this.command = command;
    }

    /*
        This decides which is the best command for the real game
     */
    bestAbsoluteChild() {
        let best = this.children[0];
        for (let child of this.children) {
            if (child.value() > best.value()) {
                best = child;
            }
        }
        return best;
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
        for (let child of this.children) {
            const factor = (child.game.currentSide === this.game.currentSide) ? 1 : -1;
            const currentScore = factor * child.uct(expansionFactor);
            if (currentScore > bestScore) {
                best = child;
                bestScore = currentScore;
            }
        }
        return best;
    }

    uct(expansionFactor) {
        return this.value() + expansionFactor * Math.sqrt(Math.log(this.parent.visits) / this.visits);
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
        let node = this;
        while (node !== null) {
            const factor = (node.game.currentSide === side) ? 1 : -1;
            node.score += factor * score;
            node.visits++;
            node = node.parent;
        }
    }

    expand() {
        const game = this.game;
        const validCommands = game.validCommands();
        validCommands.forEach((command) => {
            if (command.isDeterministic()) {
                const clone = executeCommand(game, command);
                const childNode = new DecisionNode(clone, this, 0, 0, [], command);
                this.children.push(childNode);
            } else {
                const childNode = new ChanceNode(game, this, command);
                this.children.push(childNode);
            }
        });
        return this.children;
    }

    size() {
        if (this.children.length === 0) {
            return 1;
        }
        return 1 + this.children.reduce((acc, child) => acc + child.size(), 0);
    }

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

    toString(maxLevel = 10000, minVisits = 0) {
        const result = [];
        function traverse(node, level) {
            if (level > maxLevel || node.visits < minVisits) {
                return;
            }
            const nodeDescription = " ".repeat(level) + node.describeNode();
            result.push(nodeDescription);
            for (const child of node.children) {
                traverse(child, level + 1);
            }
        }
        traverse(this, 0);
        return result.join("\n");
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
export class ChanceNode {
    constructor(game, parent, command) {
        this.id = nextNodeId++;
        this.game = game;
        this.parent = parent;
        this.command = command;
        this.children = [];
    }

    value() {
        return Infinity;
    }

    expand() {
        throw new Error("Not implemented");
    }

    backPropagate(score, side) {
        throw new Error("Not implemented");
    }
}

function showBestCommands(comands) {
    return "Best commands: \n - " + comands.join("\n - ") + "\nEnd best commands";
}

const DEFAULT_EXPANSION_FACTOR = 2;

export class MctsPlayer {
    constructor(args = {}) {
        this.args = args;
        this.args.expansionFactor = this.args.expansionFactor || DEFAULT_EXPANSION_FACTOR;
        this.args.iterations = this.args.iterations || 1000;
        this.args.nonDeterministicCommandRepetitions = this.args.nonDeterministicCommandRepetitions || 10000;
    }

    decideMove(game) {
        const startTime = Date.now();
        console.log(" ----- AI IS THINKING -----")
        if (game.validCommands().length === 1) {
            return [game.validCommands()[0]];
        }
        const rootNode = this._doDecideMove(game);
        const bestCommands = rootNode.bestCommands(game.currentSide);
        console.log(showBestCommands(rootNode.bestCommands()));
        console.log(rootNode.shape());
        console.log(rootNode.redundancy());
        // console.log(rootNode.toString(7, 10));
        console.log("Time taken: " + (Date.now() - startTime)/1000 + "s");
        return bestCommands;
    }

    _doDecideMove(game) {
        const iterations = (game.currentPhase.requiresDeepThought()) ?
            this.args.iterations : 1000;
        return this.search(game.toGame(), iterations);
    }

    search(game, iterations = this.args.iterations) {
        const rootNode = new DecisionNode(game);
        for (let i = 0; i < iterations; i++) {
            this.iterate(rootNode);
        }
        return rootNode;
    }

    iterate(rootNode) {
        let nodes = this._select(rootNode);
        nodes.forEach(node => {
            const score = scoreMcts(node.game, node.game.currentSide);
            node.backPropagate(score, node.game.currentSide);
        })
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
