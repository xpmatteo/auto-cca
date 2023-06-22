"use strict";

import { Autoplay, displayEvents } from "./ai/autoplay.js";
import { InteractiveGame } from "./interactive_game.js";
import makeGame from "./model/game.js";
import { TestScenario } from "./model/scenarios.js";
import { redraw } from "./view/graphics.js";
import loadAllImagesThen from "./view/load_all_images.js";
import { findHexFromPixel, MAP_HEIGHT, MAP_WIDTH, resizeCanvas } from "./view/map.js";
import { GraphicalContext } from "./view/graphical_context.js";

// create canvas
const canvas = document.createElement('canvas');
canvas.width = MAP_WIDTH;
canvas.height = MAP_HEIGHT;
document.body.appendChild(canvas);
const graphics = new GraphicalContext(canvas.getContext('2d'));

// create game
let scenario = new TestScenario();
let game = makeGame(scenario);
let interactiveGame = new InteractiveGame(game);

// draw initial map
loadAllImagesThen(() => {
    redraw(graphics, interactiveGame);
    resizeCanvas(canvas);
});

// setup event listeners

// track mouse clicks
canvas.addEventListener('click', function (event) {
    let hex = findHexFromPixel(canvas, event.clientX, event.clientY);
    let events = interactiveGame.onClick(hex);
    displayEvents(events);
    redraw(graphics, interactiveGame);
});

let autoplay = new Autoplay(interactiveGame);

document.getElementById('end-phase').addEventListener('click', function (event) {
    interactiveGame.endPhase();
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
        autoplay = new Autoplay(interactiveGame);
        redraw(graphics, interactiveGame);
    }
    autoplay.playout(graphics);
});

