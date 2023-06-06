"use strict";

import { Autoplay } from "./autoplay.js";
import { InteractiveGame } from "./interactive_game.js";
import makeGame from "./model/game.js";
import { ScenarioRaceToOppositeSide } from "./model/scenarios.js";
import { EndOfTurn } from "./model/turn.js";
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
    console.log(`clicked on ${event.clientX},${event.clientY}: Hex ${hex.q}, ${hex.r}`);
    interactiveGame.click(hex);
    redraw(ctx, interactiveGame);
});

// track mouse movement
const info_box = document.getElementById('info');
function handleMouseMove(event) {
    let hex = findHexFromPixel(canvas, event.clientX, event.clientY);
    let message = `${event.clientX},${event.clientY}: ${hex.q}, ${hex.r}`;
    info_box.innerHTML = message;
}
//document.addEventListener('mousemove', handleMouseMove);

const autoplay = new Autoplay(cca);

document.getElementById('end-turn').addEventListener('click', function (event) {
    cca.executeCommand(new EndOfTurn());
    autoplay.play();
    redraw(ctx, interactiveGame);
});