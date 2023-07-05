import { makeRootNode } from "./monte_carlo_tree_search_node.js";
import { playoutTillTheEndPolicy } from "./playout_policies.js";
import { chooseBestCommand } from "./autoplay.js";


export default class GreedyAIPlayer {
    constructor(params) {
    }

    decideMove(state) {
        if (state.isTerminal()) {
            return [];
        }
        if (state.validCommands().length === 1) {
            console.log("-------- AI has one only move: " + state.validCommands()[0]);
            return state.validCommands();
        }

        return [chooseBestCommand(state)];
    }
}

