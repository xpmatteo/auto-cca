"use strict";

import { Autoplay, displayEvents } from "./ai/autoplay.js";
import { InteractiveGame } from "./interactive_game.js";
import makeGame from "./model/game.js";
import { AkragasScenario, TestScenario } from "./model/scenarios.js";
import { redraw } from "./view/graphics.js";
import loadAllImagesThen from "./view/load_all_images.js";
import { findHexFromPixel, MAP_HEIGHT, MAP_WIDTH, resizeCanvas, scalePoint } from "./view/map.js";
import { GraphicalContext } from "./view/graphical_context.js";
import { CARD_IMAGE_SIZE } from "./model/cards.js";
import { Point } from "./lib/hexlib.js";

// create canvas
const canvas = document.createElement('canvas');
canvas.width = MAP_WIDTH;
canvas.height = MAP_HEIGHT + CARD_IMAGE_SIZE.y;
document.body.appendChild(canvas);
const graphics = new GraphicalContext(canvas.getContext('2d'));

// create div for displaying the search tree
let treeList = document.createElement('ul');
treeList.id = "search-tree";
document.body.appendChild(treeList);

// create game
let scenario = new AkragasScenario();
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
    let events = interactiveGame.onClick(hex, scalePoint(new Point(event.clientX, event.clientY)));
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

