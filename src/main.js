"use strict";

import { Autoplay } from "./autoplay.js";
import { InteractiveGame } from "./interactive_game.js";
import { Layout, Point, layout_pointy, pixel_to_hex } from "./lib/hexlib.js";
import { Cca } from "./model/game.js";
import { ScenarioRaceToOppositeSide } from "./model/scenarios.js";
import { EndOfTurn } from "./model/turn.js";
import { redraw } from "./view/graphics.js";
import loadAllImagesThen from "./view/load_all_images.js";


const hexWidth = 76.4;
const hexHeight = 77.4;
const layout = new Layout(layout_pointy, new Point(hexWidth, hexHeight), new Point(110, 140));

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');

const MAP_WIDTH = 1800;
const MAP_HEIGHT = 1200;

canvas.width = MAP_WIDTH;
canvas.height = MAP_HEIGHT;
let canvasScale = 1;

let scenario = new ScenarioRaceToOppositeSide();
let cca = new Cca(scenario);
cca.initialize();

let interactiveGame = new InteractiveGame(cca);

loadAllImagesThen(onAllImagesLoaded);

function onAllImagesLoaded() {
    redraw(ctx, layout, interactiveGame);
    resizeCanvas();
}

// scale canvas to fit window
function resizeCanvas() {
    let newHeight = window.innerHeight - 100;
    canvas.style.height = newHeight + 'px' ;
    canvasScale = newHeight / canvas.height;
}

function findHexFromPixel(screenX, screenY) {
    let x = (screenX - canvas.offsetLeft + window.scrollX) / canvasScale;
    let y = (screenY - canvas.offsetTop + window.scrollY) / canvasScale;
    return pixel_to_hex(layout, new Point(x, y));
}

// track mouse clicks
canvas.addEventListener('click', function (event) {
    let hex = findHexFromPixel(event.clientX, event.clientY);
    console.log(`clicked on ${event.clientX},${event.clientY}: Hex ${hex.q}, ${hex.r}`);
    interactiveGame.click(hex);
    redraw(ctx, layout, interactiveGame);
});

// track mouse movement
const info_box = document.getElementById('info');
function handleMouseMove(event) {
    let hex = findHexFromPixel(event.clientX, event.clientY);
    let message = `${event.clientX},${event.clientY}: ${hex.q}, ${hex.r}`;
    info_box.innerHTML = message;
}
//document.addEventListener('mousemove', handleMouseMove);

const autoplay = new Autoplay(cca);

document.getElementById('end-turn').addEventListener('click', function (event) {
    cca.executeCommand(new EndOfTurn());
    autoplay.play();
    redraw(ctx, layout, interactiveGame);
});