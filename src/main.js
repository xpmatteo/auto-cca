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

let images = [
    'images/cca_map_hq.jpg',
    'images/units/rom_inf_hv.png',
    'images/units/rom_inf_lt.png',
    'images/units/rom_inf_md.png',
];

load_all_images(images, draw);

function draw(images) {
    let game = new Game();
    game.addUnit(new Hex(1, 5), new RomanHeavyInfantry());
    game.addUnit(new Hex(2, 5), new RomanHeavyInfantry());
    game.addUnit(new Hex(3, 5), new RomanHeavyInfantry());
    game.addUnit(new Hex(4, 5), new RomanHeavyInfantry());
    game.addUnit(new Hex(5, 5), new RomanHeavyInfantry());
    let img = images['images/cca_map_hq.jpg'];
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

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
        draw_unit(ctx, pixelCoordinate, unit.imageName, new Point(90, 90));
    });

    resizeCanvas();
}

// scale canvas to fit window
function resizeCanvas() {
    canvas.style.height = (window.innerHeight - 100) + 'px' ;
}

// track mouse clicks
canvas.addEventListener('click', function (event) {
    console.log('click');
});

// track mouse movement
const info_box = document.getElementById('info');
function handleMouseMove(event) {
    let x = event.clientX - canvas.offsetLeft;
    let y = event.clientY - canvas.offsetTop;
    let hex = pixel_to_hex(layout, new Point(x, y));
    info_box.innerHTML = `${hex.q}, ${hex.r}, ${hex.s}`;
}
document.addEventListener('mousemove', handleMouseMove);
