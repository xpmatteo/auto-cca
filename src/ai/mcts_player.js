import { score } from "./score.js";

class TreeNode {
    constructor(game, parent = null) {
        this.game = game;
        this.parent = parent;
        this.score = 0;
        this.visits = 0;
        this.children = [];
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
            result.push(`${" ".repeat(level)}${node.score}/${node.visits}`);
            for (const child of node.children) {
                traverse(child, level + 1);
            }
        }
        traverse(this, 0);
        return result.join("\n");
    }
}

export class MctsPlayer {
    constructor(args) {
        this.args = args;
    }

    search() {
        const rootNode = new TreeNode(this.args.game);
        for (let i = 0; i < this.args.iterations; i++) {
            let node = this._select(rootNode);
            let score = this._simulate(node.game);
            this._backpropagate(node, score);
        }
        return rootNode;
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
        return node.children[0];
    }

    _backpropagate(node, score) {
        while (node !== null) {
            node.score += score;
            node.visits++;
            node = node.parent;
        }
    }

    _select(node) {
        while (!node.game.isTerminal()) {
            if (node.children.length === 0) {
                return this._expand(node);
            } else {
                node = node.bestChild();
            }
        }
        return node;
    }

    _simulate(game) {
        return score(game, game.currentSide);
    }
}
