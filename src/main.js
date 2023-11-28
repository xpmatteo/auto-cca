import { GreedyPlayer } from "./ai/greedy_player.js";
import { CARD_IMAGE_SIZE, MCTS_PLAYOUT_ITERATIONS, MCTS_SAMPLING_EXPLORATION_CHANCE } from "./config.js";
import { MCTS_EXPANSION_FACTOR, MCTS_ITERATIONS } from "./config.js";
import { Autoplay, displayEvents, RandomPlayer } from "./ai/autoplay.js";
import { MctsPlayer } from "./ai/mcts_player.js";
import { InteractiveGame } from "./interactive_game.js";
import { Point } from "./lib/hexlib.js";
import getQueryParameter from "./lib/query_string.js";
import { endPhaseCommand } from "./model/commands/EndPhaseCommand.js";
import { Dice } from "./model/dice.js";
import makeGame from "./model/game.js";
import { makeScenario } from "./model/scenarios.js";
import { GraphicalContext } from "./view/graphical_context.js";
import { redraw } from "./view/graphics.js";
import loadAllImagesThen from "./view/load_all_images.js";
import { findHexFromPixel, MAP_HEIGHT, MAP_WIDTH, resizeCanvas, scalePoint } from "./view/map.js";

// create canvas
const canvas = document.createElement('canvas');
canvas.width = MAP_WIDTH + 1.5*CARD_IMAGE_SIZE.x;
canvas.height = MAP_HEIGHT + CARD_IMAGE_SIZE.y;
document.body.appendChild(canvas);
const graphics = new GraphicalContext(canvas.getContext('2d'));

// create game and AI
const scenario = makeScenario(getQueryParameter("scenario"));
const aiPlayer = new GreedyPlayer();
// const aiPlayer = new MctsPlayer({
//     iterations: MCTS_ITERATIONS,
//     expansionFactor: MCTS_EXPANSION_FACTOR,
//     playoutIterations: MCTS_PLAYOUT_ITERATIONS,
//     samplingExplorationChance: MCTS_SAMPLING_EXPLORATION_CHANCE,
// });

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
});

// track mouse clicks
canvas.addEventListener('click', function (event) {
    let hex = findHexFromPixel(canvas, event.clientX, event.clientY);
    let events = game.onClick(hex, scalePoint(new Point(event.clientX, event.clientY)));
    displayEvents(events);
    redraw(graphics, game);
});

document.getElementById('end-phase').addEventListener('click', function (event) {
    game.executeCommand(endPhaseCommand());
    autoplay.play(graphics);
    redraw(graphics, game);
});

document.getElementById('ai-continue').addEventListener('click', function (event) {
    autoplay.play(graphics);
    redraw(graphics, game);
});

document.getElementById('playout').addEventListener('click', function (event) {
    if (game.isTerminal()) {
        reset();
    }
    autoplay.playout(graphics);
});

