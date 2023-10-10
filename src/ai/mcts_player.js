import { scoreMcts } from "./score.js";

/*
 A tree node contains
   - a game state,
   - the command that produced that state
   - the cumulated score *from the point of view of the this.game.currentSide*
   - the number of visits
 */
let nextNodeId = 0;
export class TreeNode {
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
            if (child.finalScore() > best.finalScore()) {
                best = child;
            }
        }
        return best;
    }

    finalScore() {
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
        if (this.visits === 0) {
            return Infinity;
        }
        return this.score / this.visits + expansionFactor * Math.sqrt(Math.log(this.parent.visits) / this.visits);
    }

    /**
     * Returns the best commands sequence for the real game, stopping after the first non-deterministic command,
     * and before the game changes side
     * @param {Side} side
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

    toString(maxLevel = 10000) {
        const result = [];
        function traverse(node, level) {
            if (level > maxLevel) {
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

    backPropagate(score, side) {
        let node = this;
        while (node !== null) {
            const factor = (node.game.currentSide === side) ? 1 : -1;
            node.score += factor * score;
            node.visits++;
            node = node.parent;
        }
    }

    describeNode() {
        return `${this.score.toFixed(0)}/${this.visits}: ${this.command} -> ${this.game.describeCurrentPhase()} -> ${this.children.length}`;
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
        console.log(showBestCommands(bestCommands));
        console.log(rootNode.shape());
        //console.log(rootNode.toString(4));
        console.log("Time taken: " + (Date.now() - startTime)/1000 + "s");
        return bestCommands;
    }

    _doDecideMove(game) {
        const iterations = (game.currentPhase.requiresDeepThought()) ?
            this.args.iterations : 1000;
        return this.search(game.toGame(), iterations);
    }

    search(game, iterations = this.args.iterations) {
        const rootNode = new TreeNode(game);
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
                return this._expand(node);
            } else {
                node = node.bestUctChild(this.args.expansionFactor);
            }
        }
        // node is terminal
        return [node];
    }

    _expand(node) {
        const game = node.game;
        const validCommands = game.validCommands();
        validCommands.forEach((command) => {
            const clone = this._executeCommand(game, command);
            const childNode = new TreeNode(clone, node, 0, 0, [], command);
            node.children.push(childNode);
        });
        return node.children;
    }

    /**
     * Returns a clone of the game with the command executed, and the resulting score
     * @param {Game} game
     * @param {Command} command
     * @returns {Game}
     * @private
     */
    _executeCommand(game, command) {
        if (command.isDeterministic()) {
            return this._executeDeterministicCommand(game, command);
        } else {
            return this._executeNonDeterministicCommand(game, command);
        }
    }

    /**
     * @param {Game} game
     * @param {Command} command
     * @returns {Game}
     * @private
     */
    _executeDeterministicCommand(game, command) {
        const clone = game.clone();
        clone.executeCommand(command);
        return clone;
    }

    /**
     * Execute the command N times.
     * Return the weighted average score and a representative of the clones with the score occurring most often
     * @param {Game} game
     * @param {Command} command
     * @returns {Game}
     * @private
     */
    _executeNonDeterministicCommand(game, command) {
        const results = executeCommandManyTimes(game, command, this.args.nonDeterministicCommandRepetitions);
        return results.closestCloneToAverageScore();
    }
}

/**
 * Execute the command N times, group the results by score
 *
 * @param {Game} game
 * @param {Command} command
 * @param {number} repetitions
 * @returns {NondeterministicResults}
 */
export function executeCommandManyTimes(game, command, repetitions) {
    const results = new NondeterministicResults();
    for (let i = 0; i < repetitions; i++) {
        const clone = game.clone();
        clone.executeCommand(command);
        const score = scoreMcts(clone, game.currentSide);
        results.add(score, clone);
    }
    return results;
}

class NondeterministicResults {
    constructor() {
        this.scores = new Map();
        this.clones = new Map();
    }

    add(score, clone) {
        if (!this.scores.has(score)) {
            this.scores.set(score, 1);
            this.clones.set(score, clone);
        } else {
            this.scores.set(score, this.scores.get(score) + 1);
        }
    }

    averageScore() {
        let total = 0;
        let totalWeight = 0;
        for (const [score, weight] of this.scores.entries()) {
            total += score * weight;
            totalWeight += weight;
        }
        return total / totalWeight;
    }

    closestScoreToAverageScore() {
        const averageScore = this.averageScore();
        let minDelta = Infinity;
        let score = undefined;
        for (const [key, occurrences] of this.scores.entries()) {
            const delta = Math.abs(key - averageScore);
            if (delta < minDelta) {
                minDelta = delta;
                score = key;
            }
        }
        return score;
    }

    closestCloneToAverageScore() {
        return this.clones.get(this.closestScoreToAverageScore());
    }

    tabulateScores() {
        const sortedKeys = Array.from(this.scores.keys()).sort((a, b) => b - a);
        const result = [];
        for (const key of sortedKeys) {
            result.push(`${key}: ${this.scores.get(key)}`);
        }
        result.push(`Average score: ${this.averageScore().toFixed(2)}`);
        result.push(`Closest score to average: ${this.closestScoreToAverageScore()}`);
        return result.join("\n");
    }
}
