import makeGame from "./model/game.js";
import { AkragasScenario } from "./model/scenarios.js";
import { Side } from "./model/side.js";

class Node {
    game;
    children = [];

    /**
     * @param {Game} game
     * @param {Command} command
     */
    constructor(game) {
        this.game = game;
        this.children = [];
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
                result[level] = [0, 0];
            }
            const index = node.game.currentSide === Side.CARTHAGINIAN ? 1 : 0;
            result[level][index]++;
            for (const child of node.children) {
                traverse(child, level + 1);
            }
        }
        traverse(this, 0);
        return result;
    }
}

/**
 * @param {Game} game
 * @param {depth} depth
 * @returns {Node}
 */
function search(game, depth) {
    let result = new Node(game);
    if (depth === 0) {
        return result;
    }
    game.validCommands().forEach(command => {
        const clone = game.clone();
        clone.executeCommand(command);
        const child = search(clone, depth - 1);
        result.children.push(child);
    });
    return result;
}

export function doSearch(depth) {
    const game = makeGame(new AkragasScenario());
    const tree = search(game, depth);
    console.log(tree.size());
    console.log(tree.shape().map(level => level.join(',')).join('\n'));
}

