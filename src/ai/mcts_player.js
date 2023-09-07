import { score } from "./score.js";

class TreeNode {
    constructor(game, parent = null) {
        this.game = game;
        this.parent = parent;
        this.score = 0;
        this.visits = 0;
        this.children = [];
    }

    mostVisited() {
        let best = this.children[0];
        for (let child of this.children) {
            if (child.visits > best.visits) {
                best = child;
            }
        }
        return best;
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

    bestCommands() {
        if (this.children.length === 0) {
            return [];
        }
        let best = this.mostVisited();
        if (this.command === undefined) {
            return best.bestCommands();
        }
        return [this.command].concat(best.bestCommands());
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

    toString() {
        const result = [];
        function traverse(node, level) {
            const nodeDescription = `${" ".repeat(level)}${node.score}/${node.visits}: ${node.game.currentSide} ${node.command}`;
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

export class MctsPlayer {
    constructor(args) {
        this.args = args;
    }

    search() {
        const rootNode = new TreeNode(this.args.game);
        for (let i = 0; i < this.args.iterations; i++) {
            let nodes = this._select(rootNode);
            nodes.forEach(node => {
                let score = this._simulate(node.game);
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

    _simulate(game) {
        return score(game, game.currentSide);
    }
}
