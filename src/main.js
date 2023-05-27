"use strict";

import { Hex, Layout, Point, hex_to_pixel, pixel_to_hex, layout_pointy } from "./hexlib.js";
import { load_all_images, draw_unit, draw_circle } from "./graphics.js";
import { Game, RomanHeavyInfantry } from "./game.js";

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

let game = new Game();
game.addUnit(new Hex(1, 5), new RomanHeavyInfantry());
game.addUnit(new Hex(2, 5), new RomanHeavyInfantry());
game.addUnit(new Hex(3, 5), new RomanHeavyInfantry());
game.addUnit(new Hex(4, 5), new RomanHeavyInfantry());
game.addUnit(new Hex(5, 5), new RomanHeavyInfantry());

let mapImage;

let imageUrls = [
    'images/cca_map_hq.jpg',
    'images/units/rom_inf_hv.png',
    'images/units/rom_inf_lt.png',
    'images/units/rom_inf_md.png',
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
}

function findHexFromPixel(screenX, screenY) {
    let x = screenX - canvas.offsetLeft + window.scrollX;
    let y = screenY - canvas.offsetTop + window.scrollY;
    return pixel_to_hex(layout, new Point(x, y));
}

// scale canvas to fit window
function resizeCanvas() {
   //canvas.style.height = (window.innerHeight - 100) + 'px' ;
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
    console.log(message);
}
//document.addEventListener('mousemove', handleMouseMove);
