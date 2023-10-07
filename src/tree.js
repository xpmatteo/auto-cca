import { Autoplay, displayEvents } from "./ai/autoplay.js";
import { MctsPlayer } from "./ai/mcts_player.js";
import { InteractiveGame } from "./interactive_game.js";
import { Point } from "./lib/hexlib.js";
import getQueryParameter from "./lib/query_string.js";
import { CARD_IMAGE_SIZE } from "./model/cards.js";
import { EndPhaseCommand } from "./model/commands/end_phase_command.js";
import { Dice } from "./model/dice.js";
import makeGame from "./model/game.js";
import { makeScenario } from "./model/scenarios.js";
import { GraphicalContext } from "./view/graphical_context.js";
import { redraw } from "./view/graphics.js";
import loadAllImagesThen from "./view/load_all_images.js";
import { findHexFromPixel, MAP_HEIGHT, MAP_WIDTH, resizeCanvas, scalePoint } from "./view/map.js";

// create canvas
const canvas = document.getElementById('canvas');
canvas.width = MAP_WIDTH + CARD_IMAGE_SIZE.x;
canvas.height = MAP_HEIGHT + CARD_IMAGE_SIZE.y;
document.body.appendChild(canvas);
const graphics = new GraphicalContext(canvas.getContext('2d'));

// create game and AI
const scenario = makeScenario(getQueryParameter("scenario"));
const aiPlayer = new MctsPlayer({iterations: 150000});

let game;
let autoplay;

function reset() {
    //const dice = diceReturning([RESULT_HEAVY,RESULT_HEAVY,RESULT_MEDIUM,RESULT_FLAG,RESULT_FLAG]);
    const dice = new Dice();
    game = new InteractiveGame(makeGame(scenario), dice)
    autoplay = new Autoplay(game, aiPlayer);
}
reset();

// draw initial map
loadAllImagesThen(() => {
    redraw(graphics, game);
    resizeCanvas(canvas);
    drawTree()
});

// track mouse clicks
canvas.addEventListener('click', function (event) {
    let hex = findHexFromPixel(canvas, event.clientX, event.clientY);
    let events = game.onClick(hex, scalePoint(new Point(event.clientX, event.clientY)));
    displayEvents(events);
    redraw(graphics, game);
});

document.getElementById('draw-tree').addEventListener('click', drawTree);

function drawTree() {
    const player = new MctsPlayer({iterations: 40});
    console.log("AI IS THINKING")
    const rootNode = player.search(game.toGame());
    console.log("AI HAS FINISHED THINKING: ", rootNode.size(), "nodes");

    // Convert TreeNode to vis.js data
    const nodes = [];
    const edges = [];

    /**
     * @param {TreeNode} node
     */
    function traverse(node) {
        if (node.score === 0 || node.visits < 2) return;
        const color = node.game.currentSide === game.toGame().scenario.sideSouth ? "lightblue" : "pink";
        const label = `${node.score}/${node.visits}`;
        nodes.push({id: node.id, label: label, color: color});

        for (const child of node.children) {
            const edgeLabel = child.command.toString();
            edges.push({from: node.id, to: child.id, label: edgeLabel});
            traverse(child);
        }
    }

    traverse(rootNode);
    nodes[0].label = "R";

    // Create a network
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
                levelSeparation: 100,
                nodeSpacing: 100,
                treeSpacing: 300
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

