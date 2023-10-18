import { ChanceNode, MctsPlayer } from "../ai/mcts_player.js";
import { scoreMcts } from "../ai/score.js";
import { MCTS_EXPANSION_FACTOR, MCTS_ITERATIONS } from "../config.js";

export function drawTree(game, iterations=1000, depth=1000, threshold=10) {
    const player = new MctsPlayer({iterations: iterations, expansionFactor: MCTS_EXPANSION_FACTOR});
    console.log("AI IS THINKING")
    const rootNode = player.search(game.toGame());
    console.log("AI HAS FINISHED THINKING: ", rootNode.size(), "nodes", rootNode.shape().toString());

    // Convert tree to vis.js data
    const nodes = [];
    const edges = [];

    /**
     * @param {DecisionNode} node
     * @param {number} depth
     */
    function traverse(node, depth) {
        if (node.visits < threshold) return;
        if (depth === 0) return;
        const color = node.game.currentSide === game.toGame().scenario.sideSouth ? "lightblue" : "pink";
        const label = `${node.visits || '-'}/${node.visits}\n${scoreMcts(node.game)}`;
        const shape = node instanceof ChanceNode ? "box" : "circle";
        nodes.push({id: node.id, label: label, color: color, shape: shape});

        for (const child of node.children) {
            const edgeLabel = child.command.toString();
            edges.push({from: node.id, to: child.id, label: edgeLabel});
            traverse(child, depth - 1);
        }
    }

    traverse(rootNode, depth);
    console.log("traversed")
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
    console.log("network created");
}
