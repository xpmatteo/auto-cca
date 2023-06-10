"use strict";

import { Autoplay, displayEvents } from "./autoplay.js";
import { InteractiveGame } from "./interactive_game.js";
import makeGame from "./model/game.js";
import { ScenarioRaceToOppositeSide } from "./model/scenarios.js";
import { EndPhaseCommand } from "./model/commands.js";
import { redraw } from "./view/graphics.js";
import loadAllImagesThen from "./view/load_all_images.js";
import { findHexFromPixel, MAP_HEIGHT, MAP_WIDTH, resizeCanvas } from "./view/map.js";

// create canvas
const canvas = document.createElement('canvas');
canvas.width = MAP_WIDTH;
canvas.height = MAP_HEIGHT;
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');

// create game
let scenario = new ScenarioRaceToOppositeSide();
let cca = makeGame(scenario);
let interactiveGame = new InteractiveGame(cca);

// draw initial map
loadAllImagesThen(() => {
    redraw(ctx, interactiveGame);
    resizeCanvas(canvas);
});

// setup event listeners

// track mouse clicks
canvas.addEventListener('click', function (event) {
    let hex = findHexFromPixel(canvas, event.clientX, event.clientY);
    let events = interactiveGame.onClick(hex);
    displayEvents(events);
    redraw(ctx, interactiveGame);
});


const autoplay = new Autoplay(interactiveGame);

document.getElementById('end-phase').addEventListener('click', function (event) {
    interactiveGame.endPhase();
    autoplay.play(ctx);
    redraw(ctx, interactiveGame);
});

