import { InteractiveGame } from "../interactive_game.js";
import { randomElement } from "../lib/random.js";
import { Command } from "../model/commands/commands.js";
import { Game } from "../model/game.js";
import OpenLoopNode from "./OpenLoopNode.js";
import { scoreMcts } from "./score.js";


const DEFAULT_EXPANSION_FACTOR = 1.4142135623730951;

export class OpenLoopMctsPlayer {
    static isSearching = false;

    constructor(args = {}) {
        this.args = args;
        this.args.expansionFactor = this.args.expansionFactor || DEFAULT_EXPANSION_FACTOR;
        this.args.iterations = this.args.iterations || 1000;
        this.args.playoutIterations = this.args.playoutIterations || 20;
        this.args.logfunction = this.args.logfunction || console.log;
        this.args.samplingExplorationChance = this.args.samplingExplorationChance || 0.01;
        this.args.note = this.args.note || "";
    }

    /**
     * @param {Game} game
     * @returns {Command[]}
     */
    decideMove(game) {
        const startTime = Date.now();
        this.args.logfunction(" ----- AI IS THINKING -----")
        if (game.validCommands().length === 1) {
            return [game.validCommands()[0]];
        }
        const iterations = (game.currentPhase.requiresDeepThought()) ?
            this.args.iterations : 1000;
        const rootNode = this.search(game.toGame(), iterations);
        const bestCommands = rootNode.bestCommands(game.currentSide);
        this.args.logfunction(showBestCommands(rootNode.bestCommands(game.currentSide)));
        this.args.logfunction(rootNode.shape());
        this.args.logfunction(rootNode.toString(2));
        //this.args.logfunction(rootNode.redundancy());
        // this.args.logfunction(rootNode.toString(7, 10));
        this.args.logfunction("Time taken: " + (Date.now() - startTime)/1000 + "s");
        return bestCommands;
    }

    /**
     * @param {Game} game
     * @param {number} iterations
     * @returns {OpenLoopNode}
     */
    search(game, iterations = this.args.iterations) {
        OpenLoopMctsPlayer.isSearching = true;
        const rootNode = new OpenLoopNode(game.currentSide);
        for (let i = 0; i < iterations; i++) {
            if (i % 10000 === 0) this.args.logfunction("Iteration " + i);
            this.iterate(game, rootNode);
        }
        OpenLoopMctsPlayer.isSearching = false;
        return rootNode;
    }

    /**
     * @param {Game} game
     * @param {OpenLoopNode} rootNode
     */
    iterate(game, rootNode) {
        const [newGame, leafNode] = this._select(game, rootNode);
        const score = this._simulate(newGame);
        leafNode.backPropagate(score, newGame.currentSide);
    }

    /**
     * @param {Game} game
     * @param {OpenLoopNode} node
     * @returns {[Game,OpenLoopNode]}
     * @private
     */
    _select(game, node) {
        while (!game.isTerminal()) {
            if (node.childrenSize === 0) {
                return node.bestUctChild(game, this.args.expansionFactor);
            } else {
                [game, node] = node.bestUctChild(game, this.args.expansionFactor);
            }
        }
        // game is terminal
        return [game, node];
    }

    /**
     * @param {Game} game
     * @returns {number}
     * @private
     */
    _simulate(game) {
        const clone = game.clone();
        for (let i = 0; i < this.args.playoutIterations && !clone.isTerminal(); i++) {
            const commands = clone.validCommands();
            const command = randomElement(commands);
            if (command)
                clone.executeCommand(command);
        }
        const number = scoreMcts(clone, game.currentSide);
        // return number;
        if (number === 0) {
            return 0;
        }
        if (number < 0) {
            return -1;
        }
        if (number > 0) {
            return 1;
        }
    }

    toString() {
        return `MctsPlayer(${this.args.iterations}, ${this.args.playoutIterations}, ${this.args.samplingExplorationChance}, ${this.args.note}))`;
    }
}

function showBestCommands(comands) {
    return "Best commands: \n - " + comands.join("\n - ") + "\nEnd best commands";
}
