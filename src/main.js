"use strict";

import { Hex, Layout, Point, hex_to_pixel, pixel_to_hex, layout_pointy } from "./hexlib.js";
import { load_all_images, draw_unit, draw_circle } from "./graphics.js";


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

function even(n) {
    return n % 2 === 0;
}

const MAP = {
    foreach_hex: function (f) {
        for (let r=0; r<=8; r++) {
            let col_start = -Math.trunc(r/2);
            let num_cols = even(r) ? 13 : 12;
            for (let q=col_start; q < col_start + num_cols; q++) {
                let hex = new Hex(q, r);
                f(hex);
            }
        }
    }
};

function draw(images) {
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
    MAP.foreach_hex(draw_circle_in_top_vertex);
    MAP.foreach_hex(draw_coordinates);
    let pixelCoordinate = hex_to_pixel(layout, new Hex(6, 0));
    draw_unit(ctx, pixelCoordinate, 'rom_inf_hv', new Point(90, 90));

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
