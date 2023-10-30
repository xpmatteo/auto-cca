import { ChanceNode, MctsPlayer } from "../ai/mcts_player.js";
import { scoreMcts } from "../ai/score.js";
import { MCTS_EXPANSION_FACTOR, MCTS_ITERATIONS, MCTS_SAMPLING_EXPLORATION_CHANCE } from "../config.js";

export function drawTree(game, iterations=1000, playoutIterations = 10, depth=1000, threshold=10, prune=0) {
    console.log(`drawTree(${iterations}, ${playoutIterations}, ${depth}, ${threshold}, ${prune})`);
    const player = new MctsPlayer({
        iterations: iterations,
        expansionFactor: MCTS_EXPANSION_FACTOR,
        playoutIterations: playoutIterations,
        samplingExplorationChance: MCTS_SAMPLING_EXPLORATION_CHANCE,
    });
    console.log("AI IS THINKING")
    let rootNode = player.search(game.toGame());
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
        let color;
        if (node.isOnBestPath) {
            if (node.game.currentSide === game.toGame().scenario.sideSouth) {
                color = {
                    background: "lightblue",
                    border: "blue",
                }
            } else {
                color = {
                    background: "pink",
                    border: "red",
                }
            }
        } else {
            color = node.game.currentSide === game.toGame().scenario.sideSouth ? "lightblue" : "pink";
        }
        const label = node.score === undefined ?
            `${node.value().toFixed(3)}\n${scoreMcts(node.game)}` :
            `${node.score}/${node.visits}\n${scoreMcts(node.game)}`;
        const shape = node instanceof ChanceNode ? "box" : "circle";
        nodes.push({id: node.id, label: label, color: color, shape: shape});

        for (const child of node.children) {
            const edgeLabel = node.score === undefined ? "" : child.command.toString();
            edges.push({from: node.id, to: child.id, label: edgeLabel});
            traverse(child, depth - 1);
        }
    }

    function enhanceBestPath(node) {
        node.isOnBestPath = true;

        if (node.children.length) {
            enhanceBestPath(node.bestAbsoluteChild());
        }
    }

    function prunePrefix(node, prune) {
        if (prune === 0) return;
        node.children = [node.bestAbsoluteChild()];
        prunePrefix(node.children[0], prune-1);
    }

    prunePrefix(rootNode, Number(prune));
    enhanceBestPath(rootNode);
    traverse(rootNode, Number(depth));
    console.log("traversed")
    nodes[0].color = "red";
    nodes[0].width = 100;

    // Create a network
    // See https://visjs.github.io/vis-network/docs/network/
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

    const container = document.getElementById('treeContainer');
    const network = new vis.Network(container, data, options);
    console.log("network created");
}
