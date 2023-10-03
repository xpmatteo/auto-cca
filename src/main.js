import { Autoplay, displayEvents } from "./ai/autoplay.js";
import { InteractiveGame } from "./interactive_game.js";
import makeGame from "./model/game.js";
import { redraw } from "./view/graphics.js";
import loadAllImagesThen from "./view/load_all_images.js";
import { findHexFromPixel, MAP_HEIGHT, MAP_WIDTH, resizeCanvas, scalePoint } from "./view/map.js";
import { GraphicalContext } from "./view/graphical_context.js";
import { CARD_IMAGE_SIZE } from "./model/cards.js";
import { Point } from "./lib/hexlib.js";
import { EndPhaseCommand } from "./model/commands/end_phase_command.js";
import { MctsPlayer } from "./ai/mcts_player.js";
import getParameterByName from "./lib/query_string.js";
import { makeScenario } from "./model/scenarios.js";
import { diceReturning, RESULT_FLAG, RESULT_HEAVY, RESULT_MEDIUM } from "./model/dice.js";

// create canvas
const canvas = document.createElement('canvas');
canvas.width = MAP_WIDTH + CARD_IMAGE_SIZE.x;
canvas.height = MAP_HEIGHT + CARD_IMAGE_SIZE.y;
document.body.appendChild(canvas);
const graphics = new GraphicalContext(canvas.getContext('2d'));

// create game
const scenario = makeScenario(getParameterByName("scenario"));
let game = makeGame(scenario, diceReturning([RESULT_HEAVY,RESULT_HEAVY,RESULT_MEDIUM,RESULT_FLAG,RESULT_FLAG]));
let interactiveGame = new InteractiveGame(game);

// create AI
const aiPlayer = new MctsPlayer({iterations: 150000});
const autoplay = new Autoplay(interactiveGame, aiPlayer);

// draw initial map
loadAllImagesThen(() => {
    redraw(graphics, interactiveGame);
    resizeCanvas(canvas);
});

// track mouse clicks
canvas.addEventListener('click', function (event) {
    let hex = findHexFromPixel(canvas, event.clientX, event.clientY);
    let events = interactiveGame.onClick(hex, scalePoint(new Point(event.clientX, event.clientY)));
    displayEvents(events);
    redraw(graphics, interactiveGame);
});

document.getElementById('end-phase').addEventListener('click', function (event) {
    interactiveGame.executeCommand(new EndPhaseCommand());
    autoplay.play(graphics);
    redraw(graphics, interactiveGame);
});

document.getElementById('ai-continue').addEventListener('click', function (event) {
    autoplay.play(graphics);
    redraw(graphics, interactiveGame);
});

document.getElementById('playout').addEventListener('click', function (event) {
    if (game.isTerminal()) {
        game = makeGame(scenario);
        interactiveGame = new InteractiveGame(game);
        redraw(graphics, interactiveGame);
    }
    autoplay.playout(graphics);
});

