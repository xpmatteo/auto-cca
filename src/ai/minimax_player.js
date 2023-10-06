import { score } from "./score.js";

class TreeNode {
    constructor(score) {
        this.score = score;
        this.children = [];
    }

    /**
     * @returns {[Command]}
     */
    bestCommands() {
        if (this.children.length === 0) {
            return [];
        }
        return [this.bestCommand].concat(this.bestChild.bestCommands());
    }

    /**
     * @returns {number}
     */
    size() {
        if (this.children.length === 0) {
            return 1;
        }
        return 1 + this.children.reduce((acc, child) => acc + child.size(), 0);
    }

    /**
     * @returns {[number]}
     */
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

}

export class MinimaxPlayer {
    constructor(depth) {
        this.depth = depth;
    }

    /**
     * @param {Game} game
     * @returns {[Command]}
     */
    decideMove(game) {
        const treeRoot = this.search(game, this.depth);
        console.log("Minimax player Tree size: ", treeRoot.size(), " shape: ", treeRoot.shape());
        const bestCommands = treeRoot.bestCommands();
        console.log(bestCommands);
        return bestCommands;
    }

    /**
     * @param {Game} game
     * @param {number} depth
     * @returns {TreeNode}
     */
    search(game, depth) {
        this.visited = new Set();
        return this._search(game, game.currentSide, depth);
    }
    _search(game, side, depth) {
        if (depth === 0 || game.currentSide !== side) {
            const theScore = score(game, game.currentSide);
            return new TreeNode(theScore)
        }
        const rootNode = new TreeNode();
        this.visited.add(game.toString());
        const validCommands = game.validCommands();
        rootNode.score = -Infinity;
        validCommands.forEach((command) => {
            // if (!command.isDeterministic()) {
            //     return;
            // }
            const clone = game.clone();
            clone.executeCommand(command);
            if (this.alreadySeen(clone)) {
                return;
            }
            const child = this._search(clone, side, depth - 1);
            rootNode.children.push(child);
            if (child.score > rootNode.score) {
                rootNode.score = child.score;
                rootNode.bestCommand = command;
                rootNode.bestChild = child;
            }
        });
        return rootNode;
    }

    alreadySeen(game) {
        return this.visited.has(game.toString());
    }
}
