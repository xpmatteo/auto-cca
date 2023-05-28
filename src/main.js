"use strict";

import { Hex, Layout, Point, hex_to_pixel, pixel_to_hex, layout_pointy } from "./hexlib.js";
import { load_all_images, draw_unit, draw_circle, highlight_hex } from "./graphics.js";
import { CarthaginianHeavyInfantry, Game, RomanHeavyInfantry } from "./game.js";

// Constants for the hexagon dimensions
const hexWidth = 76.4;
const hexHeight = 77.4;
const layout = new Layout(layout_pointy, new Point(hexWidth, hexHeight), new Point(110, 140));

// Canvas setup
const canvas = document.createElement('canvas');
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');

// Set canvas dimensions
canvas.width = 1800; 
canvas.height = 1200;
let canvasScale = 1;

let game = new Game();
game.addUnit(new Hex(1, 5), new RomanHeavyInfantry());
game.addUnit(new Hex(2, 5), new RomanHeavyInfantry());
game.addUnit(new Hex(3, 5), new RomanHeavyInfantry());
game.addUnit(new Hex(4, 5), new RomanHeavyInfantry());
game.addUnit(new Hex(5, 5), new RomanHeavyInfantry());

game.addUnit(new Hex(2, 3), new CarthaginianHeavyInfantry());
game.addUnit(new Hex(2, 2), new CarthaginianHeavyInfantry());
game.addUnit(new Hex(3, 2), new CarthaginianHeavyInfantry());

let mapImage;

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

function onAllImagesLoaded(images) {
    mapImage = images['images/cca_map_hq.jpg'];
    redraw();
    resizeCanvas();
}


function redraw() {
    ctx.drawImage(mapImage, 0, 0, canvas.width, canvas.height);

    function draw_circle_in_top_vertex(hex) {
        let pixelCoordinate = hex_to_pixel(layout, hex);
        draw_circle(ctx, pixelCoordinate.x, pixelCoordinate.y-hexHeight, 5);
    }

    function draw_coordinates(hex) {
        ctx.font = "12pt Arial";
        ctx.fillStyle = "black";
        let pixelCoordinate = hex_to_pixel(layout, hex);
        ctx.fillText(`${hex.q}, ${hex.r}`, pixelCoordinate.x-12, pixelCoordinate.y-20);        
    }
    //game.foreachHex(draw_circle_in_top_vertex);
    game.foreachHex(draw_coordinates);
    game.foreachUnit((unit, hex) => {
        let pixelCoordinate = hex_to_pixel(layout, hex);
        draw_unit(ctx, pixelCoordinate, unit);
    });

    highlight_hex(ctx, layout, hex_to_pixel(layout, new Hex(0, 0)));
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
    redraw();
});

// track mouse movement
const info_box = document.getElementById('info');
function handleMouseMove(event) {
    let hex = findHexFromPixel(event.clientX, event.clientY);
    let message = `${event.clientX},${event.clientY}: ${hex.q}, ${hex.r}`;
    info_box.innerHTML = message;
}
document.addEventListener('mousemove', handleMouseMove);
