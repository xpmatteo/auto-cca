import makeGame from "./model/game.js";
import { MctsPlayer } from "./ai/mcts_player.js";
import { scoreMcts } from "./ai/score.js";
import getQueryParameter from "./lib/query_string.js";
import { MCTS_EXPANSION_FACTOR, MCTS_ITERATIONS } from "./config.js";
import { makeScenario } from "./model/scenarios.js";

const scenario = makeScenario(getQueryParameter("scenario"));
const game = makeGame(scenario);
drawTree();

function drawTree() {
    const player = new MctsPlayer({iterations: MCTS_ITERATIONS, expansionFactor: MCTS_EXPANSION_FACTOR});
    console.log("AI IS THINKING")
    const rootNode = player.search(game.toGame());
    console.log("AI HAS FINISHED THINKING: ", rootNode.size(), "nodes", rootNode.shape().toString());

    // Convert TreeNode to vis.js data
    const nodes = [];
    const edges = [];

    // hand picked for 1-to-1 scenario
    const BEST_MOVES = [
        "Move [1,4] to [-1,4]",
        "Move [1,4] to [-1,5]",
        "Move [1,4] to [0,5]",
        "Move [1,4] to [1,5]",
        "Move [1,4] to [2,5]",
        "Move [1,4] to [3,4]",
    ];

    /**
     * @param {TreeNode} node
     */
    function traverse(node) {
        if (node.visits < 2) return;
        const color = node.game.currentSide === game.toGame().scenario.sideSouth ? "lightblue" : "pink";
        const label = `${node.score}/${node.visits}\n${scoreMcts(node.game)}`;
        const isBestMove = node.command && BEST_MOVES.includes(node.command.toString());
        const shape = isBestMove? "box" : "circle";
        nodes.push({id: node.id, label: label, color: color, shape: shape});

        for (const child of node.children) {
            const edgeLabel = child.command.toString();
            edges.push({from: node.id, to: child.id, label: edgeLabel});
            traverse(child);
        }
    }

    traverse(rootNode);

    // Create a network
    // See https://visjs.github.io/vis-network/docs/network/
    const container = document.getElementById('treeContainer');
    const data = {
        nodes: new vis.DataSet(nodes),
        edges: new vis.DataSet(edges)
    };
    const options = {
        layout: {
            hierarchical: {
                direction: 'LR',
                sortMethod: 'directed',
                shakeTowards: 'roots',
                levelSeparation: 100,
                nodeSpacing: 100,
                treeSpacing: 300,
            }
        },
        nodes: {
            shape: 'circle',
            size: 30
        },
        edges: {
            arrows: {
                to: {
                    enabled: true,
                    type: 'arrow'
                }
            }
        },
    };

    const network = new vis.Network(container, data, options);
}

