import { randomElement } from "../lib/random.js";
import { Side } from "../model/side.js";

export default class OpenLoopNode {
    /**
     * @param {Side} side
     * @param {number} score
     * @param {number} visits
     * @param {Map<Command, OpenLoopNode>} children
     */
    constructor(side, score= 0, visits= 0, children = new Map()) {
        this.side = side;
        this.score = score;
        this.visits = visits;
        this.children = children;
    }

    /**
     * @param {Game} game
     * @param {number} expansionFactor
     * @returns {OpenLoopNode}
     */
    bestUctChild(game, expansionFactor= 2.4142) {
        const chosenCommand = randomElement(game.validCommands());
        game.executeCommand(chosenCommand);
        const newChild = new OpenLoopNode(game.currentSide);
        this.children.set(chosenCommand, newChild);
        return newChild;
    }
}
