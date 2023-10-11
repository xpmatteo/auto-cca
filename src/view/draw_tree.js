import { MctsPlayer } from "../ai/mcts_player.js";
import { scoreMcts } from "../ai/score.js";
import { MCTS_EXPANSION_FACTOR, MCTS_ITERATIONS } from "../config.js";

export function drawTree(game) {
    const player = new MctsPlayer({iterations: MCTS_ITERATIONS, expansionFactor: MCTS_EXPANSION_FACTOR});
    console.log("AI IS THINKING")
    const rootNode = player.search(game.toGame());
    console.log("AI HAS FINISHED THINKING: ", rootNode.size(), "nodes", rootNode.shape().toString());

    // Convert tree to vis.js data
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

    const threshold = rootNode.visits / 100;

    function showNumber(number) {
        if (number > 1000) {
            return Math.round(number / 1000) + "k";
        }
        return number;
    }

    /**
     * @param {DecisionNode} node
     */
    function traverse(node) {
        if (node.visits < threshold) return;
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
    nodes[0].color = "red";
    nodes[0].width = 100;

    // Create a network
    // See https://visjs.github.io/vis-network/docs/network/
    const container = document.getElementById('treeContainer');
    const data = {
        nodes: new vis.DataSet(nodes),
        edges: new vis.DataSet(edges)
    };
    const options = {
        layout: {
            improvedLayout: false,
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
