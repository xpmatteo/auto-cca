import { Autoplay, displayEvents } from "./ai/autoplay.js";
import { MctsPlayer } from "./ai/mcts_player.js";
import { InteractiveGame } from "./interactive_game.js";
import { Point } from "./lib/hexlib.js";
import getParameterByName from "./lib/query_string.js";
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
const canvas = document.createElement('canvas');
canvas.width = MAP_WIDTH + CARD_IMAGE_SIZE.x;
canvas.height = MAP_HEIGHT + CARD_IMAGE_SIZE.y;
document.body.appendChild(canvas);
const graphics = new GraphicalContext(canvas.getContext('2d'));

// create game and AI
const scenario = makeScenario(getParameterByName("scenario"));
const aiPlayer = new MctsPlayer({iterations: 150000});

let game;
let autoplay;

function reset() {
    //cosnst dice = diceReturning([RESULT_HEAVY,RESULT_HEAVY,RESULT_MEDIUM,RESULT_FLAG,RESULT_FLAG]);
    const dice = new Dice();
    game = new InteractiveGame(makeGame(scenario))
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
    game.executeCommand(new EndPhaseCommand());
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

