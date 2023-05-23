"use strict";

// Constants for the hexagon dimensions
const hexWidth = 76;
const hexHeight = 77;
const layout = new Layout(layout_pointy, new Point(hexWidth, hexHeight), new Point(110, 140));

// Canvas setup
const canvas = document.createElement('canvas');
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');

// Set canvas dimensions
canvas.width = 1800; 
canvas.height = 1200;


let img = new Image();
img.src = 'images/cca_map_hq.jpg';      
img.onload = draw;

function draw() {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    function d(hex) {
        let pixelCoordinate = hex_to_pixel(layout, hex);
        drawCircle(ctx, pixelCoordinate.x, pixelCoordinate.y, 5);
    }
    d(new Hex(0, 0, 0));
    d(new Hex(1, 0, -1));
    d(new Hex(2, 0, -2));
    d(new Hex(10, 0, -10));

    
    d(new Hex(-4, 8, -4));
}

