import { score, scoreMcts } from "./score.js";

/*
 A tree node contains
   - a game state,
   - the command that produced that state
   - the cumulated score *from the point of view of the this.game.currentSide*
   - the number of visits
 */
let nextNodeId = 0;
export class TreeNode {
    constructor(game, parent = null, score=0, visits=0, children=[]) {
        this.id = nextNodeId++;
        this.game = game;
        this.parent = parent;
        this.score = score || 0;
        this.visits = visits || 0;
        this.children = children || [];
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
        return `${this.score}/${this.visits}: ${this.command} -> ${this.game.describeCurrentPhase()} -> ${this.children.length}`;
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
            let score = this._simulate(node.game);
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
            const clone = game.clone();
            clone.executeCommand(command);
            const childNode = new TreeNode(clone, node);
            childNode.command = command;
            node.children.push(childNode);
        });
        return node.children;
    }

    _simulate(game) {
        return scoreMcts(game, game.currentSide);
    }
}
