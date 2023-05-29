"use strict";

import { hexOf, Layout, Point, hex_to_pixel, pixel_to_hex, layout_pointy } from "./hexlib.js";
import { load_all_images, redraw } from "./graphics.js";
import { Game, CarthaginianHeavyInfantry, RomanHeavyInfantry } from "./game.js";
import { InteractiveGame } from "./interactive_game.js";

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

let game = new InteractiveGame(new Game());
game.addUnit(hexOf(1, 5), new RomanHeavyInfantry());
game.addUnit(hexOf(2, 5), new RomanHeavyInfantry());
game.addUnit(hexOf(3, 5), new RomanHeavyInfantry());
game.addUnit(hexOf(4, 5), new RomanHeavyInfantry());
game.addUnit(hexOf(5, 5), new RomanHeavyInfantry());

game.addUnit(hexOf(2, 3), new CarthaginianHeavyInfantry());
game.addUnit(hexOf(2, 2), new CarthaginianHeavyInfantry());
game.addUnit(hexOf(3, 2), new CarthaginianHeavyInfantry());

let imageUrls = [
    'images/cca_map_hq.jpg',
    
    'images/units/rom_aux.png',
    'images/units/rom_cav_hv.png',
    'images/units/rom_cav_lt.png',
    'images/units/rom_cav_md.png',
    'images/units/rom_char.png',
    'images/units/rom_elephant.png',
    'images/units/rom_inf_hv.png',
    'images/units/rom_inf_lt.png',
    'images/units/rom_inf_lt_bow.png',
    'images/units/rom_inf_lt_sling.png',
    'images/units/rom_inf_md.png',
    'images/units/rom_inf_war.png',
    'images/units/rom_leader.png',
    'images/units/rom_leader_grey.png',
    'images/units/rom_leader_grey_rectangular.png',
    'images/units/rom_ship.png',
    'images/units/rom_warmachine.png',

    'images/units/car_aux.png',
    'images/units/car_cav_hv.png',
    'images/units/car_cav_lt.png',
    'images/units/car_cav_md.png',
    'images/units/car_char.png',
    'images/units/car_elephant.png',
    'images/units/car_inf_hv.png',
    'images/units/car_inf_lt.png',
    'images/units/car_inf_lt_bow.png',
    'images/units/car_inf_lt_slings.png',
    'images/units/car_inf_md.png',
    'images/units/car_inf_wa.png',
    'images/units/car_leader.png',
];

load_all_images(imageUrls, onAllImagesLoaded);

function onAllImagesLoaded() {
    redraw(ctx, layout, game);
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
    game.click(hex);
    redraw(ctx, layout, game);
});

// track mouse movement
const info_box = document.getElementById('info');
function handleMouseMove(event) {
    let hex = findHexFromPixel(event.clientX, event.clientY);
    let message = `${event.clientX},${event.clientY}: ${hex.q}, ${hex.r}`;
    info_box.innerHTML = message;
}
document.addEventListener('mousemove', handleMouseMove);
