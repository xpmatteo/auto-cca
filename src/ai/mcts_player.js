import { score, scoreMcts } from "./score.js";

export class TreeNode {
    constructor(game, parent = null, score, visits, children) {
        this.game = game;
        this.parent = parent;
        this.score = score || 0;
        this.visits = visits || 0;
        this.children = children || [];
    }

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

    bestUctChild(expansionFactor) {
        let best = this.children[0];
        for (let child of this.children) {
            if (child.uct(expansionFactor) > best.uct(expansionFactor)) {
                best = child;
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
     * Returns the best commands sequence for the AI, stopping at the first non-deterministic command.
     * @param {Side} side
     * @returns {[]|[*]|[*]|*|*[]|*[]}
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
            const nodeDescription = `${" ".repeat(level)}${node.score}/${node.visits}: ${node.game.currentSide.name} ${node.command}`;
            result.push(nodeDescription);
            for (const child of node.children) {
                traverse(child, level + 1);
            }
        }
        traverse(this, 0);
        return result.join("\n");
    }
}

const DEFAULT_EXPANSION_FACTOR = 1.4142;

function showBestCommands(comands) {
    return "Best commands: \n - " + comands.join("\n - ") + "\nEnd best commands";
}

export class MctsPlayer {
    constructor(args) {
        this.args = args;
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
        const originalSide = game.currentSide;
        const rootNode = new TreeNode(game);
        for (let i = 0; i < iterations; i++) {
            let nodes = this._select(rootNode);
            nodes.forEach(node => {
                let score = this._simulate(node.game, originalSide);
                this._backpropagate(node, score);
            })
        }
        return rootNode;
    }

    _select(node) {
        while (!node.game.isTerminal()) {
            if (node.children.length === 0) {
                return this._expand(node);
            } else {
                node = node.bestUctChild(this.args.expansionFactor || DEFAULT_EXPANSION_FACTOR);
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

    _backpropagate(node, score) {
        while (node !== null) {
            node.score += score;
            node.visits++;
            node = node.parent;
        }
    }

    _simulate(game, originalSide) {
        const theScore = scoreMcts(game, game.currentSide);
        if (game.currentSide === originalSide) {
            return theScore;
        } else {
            return -theScore;
        }
    }
}
