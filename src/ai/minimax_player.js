import { score } from "./score.js";

class TreeNode {
    constructor(score) {
        this.score = score;
        this.children = [];
    }

    addChild(game, command) {
        const clone = game.clone();
        clone.executeCommand(command);
        const theScore = score(clone, clone.currentSide);
        this.children.push(new TreeNode(theScore));
    }
}

export class MinimaxPlayer {
    search(game, depth) {
        if (depth === 0) {
            const sco = score(game, game.currentSide);
            return new TreeNode(sco)
        }
        const rootNode = new TreeNode();
        game.validCommands().forEach((command) => {
            rootNode.addChild(game, command);
        });
        rootNode.score = -Infinity;
        for (let i = 0; i < rootNode.children.length; i++) {
            const child = rootNode.children[i];
            rootNode.score = Math.max(rootNode.score, child.score);
        }
        return rootNode;
    }
}
