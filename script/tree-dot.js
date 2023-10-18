import { Side } from "../src/model/side.js";
import { ChanceNode, MctsPlayer } from "../src/ai/mcts_player.js";
import { scoreMcts } from "../src/ai/score.js";
import { MCTS_EXPANSION_FACTOR, MCTS_ITERATIONS } from "../src/config.js";
import makeGame from "../src/model/game.js";
import { AkragasScenario, OneToOneMeleeScenario } from "../src/model/scenarios.js";
import * as fs from 'fs';

const DEPTH = 6;
const game = makeGame(new OneToOneMeleeScenario());
const ITERATIONS = 10000;

const player = new MctsPlayer({iterations: ITERATIONS, expansionFactor: MCTS_EXPANSION_FACTOR});
console.log("AI IS THINKING");
const rootNode = player.search(game.toGame());
console.log("AI HAS FINISHED THINKING: ", rootNode.size(), "nodes", rootNode.shape().toString());

const THRESHOLD = 1 //rootNode.visits / 100;

let dotRepresentation = "digraph Tree {\noverlap=false\n";
let count = 0;
function traverse(node, depth) {

    const label = `${node.score || '-'}/${node.visits}\n${scoreMcts(node.game)}`;
    const isChanceNode = node instanceof ChanceNode;
    const color = count++ === 0 ? 'red' :
        node.game.currentSide === Side.CARTHAGINIAN ? 'pink' :
            'lightblue';
    const shape = isChanceNode ? 'box' : 'ellipse';

    dotRepresentation += `  ${node.id} [label="${label}", shape=${shape}, style=filled, fillcolor=${color}, color=${color}];\n`;

    if (depth === 0) return;
    if (node.visits < THRESHOLD) return;
    for (const child of node.children) {
        const edgeLabel = child.command.toString();
        dotRepresentation += `  ${node.id} -> ${child.id} [label="${edgeLabel}"];\n`;
        traverse(child, depth-1);
    }
}

traverse(rootNode, DEPTH);
dotRepresentation += "}";

fs.writeFileSync('/tmp/tree.dot', dotRepresentation);

console.log("DOT representation saved to /tmp/tree.dot");

