"use strict";

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

let img = new Image();
img.src = 'images/cca_map_hq.jpg';      
img.onload = draw;

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
}

function draw_unit(hex, unit, size) {
    let pixelCoordinate = hex_to_pixel(layout, hex);
    let img = new Image();    
    img.src = `images/units/${unit}.png`;      
    img.onload = function () {
        ctx.drawImage(img, pixelCoordinate.x-size.x/2, pixelCoordinate.y-size.y/2, size.x, size.y);
        ctx.font = "16pt Arial";
        ctx.fillStyle = "black";
        ctx.fillText("4", pixelCoordinate.x+18, pixelCoordinate.y+size.y/2-10);

        // surround bitmap with a black border
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 5;
        ctx.strokeRect(pixelCoordinate.x-size.x/2, pixelCoordinate.y-size.y/2, size.x, size.y);        
    };
}

function draw() {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    function draw_circle_in_top_vertex(hex) {
        let pixelCoordinate = hex_to_pixel(layout, hex);
        drawCircle(ctx, pixelCoordinate.x, pixelCoordinate.y-hexHeight, 5);
    }

        ctx.font = "12pt Arial";
        ctx.fillStyle = "black";
        let pixelCoordinate = hex_to_pixel(layout, hex);
        ctx.fillText(`${hex.q}, ${hex.r}`, pixelCoordinate.x-12, pixelCoordinate.y-20);        
    }
    MAP.foreach_hex(draw_circle_in_top_vertex);
    MAP.foreach_hex(draw_coordinates);
    draw_unit(new Hex(0, 0), 'rom_inf_hv', new Point(90, 90));
}

// execute after a delay
canvas.addEventListener('click', function (event) {
    console.log('click');
    let u = document.getElementById('the-unit');
    u.style.transform = "translateX(100px)";
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
