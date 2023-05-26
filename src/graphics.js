'use strict';

const IMAGES = {}

export function load_all_images(list_of_image_urls, continuation) {    
    let num_images = list_of_image_urls.length;
    let num_loaded = 0;
    list_of_image_urls.forEach(function (url) {
        let img = new Image();
        img.src = url;
        img.onload = function () {
            num_loaded++;
            if (num_loaded === num_images) {
                continuation(IMAGES);
            }
        };
        IMAGES[url] = img;
    });
}

export function draw_circle(ctx, x, y, radius) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.closePath();
}

export function draw_unit(ctx, pixelCoordinate, unit, size) {    
    let url = `images/units/${unit}.png`;      
    let img = IMAGES[url];
    ctx.drawImage(img, pixelCoordinate.x-size.x/2, pixelCoordinate.y-size.y/2, size.x, size.y);
    ctx.font = "16pt Arial";
    ctx.fillStyle = "black";
    ctx.fillText("4", pixelCoordinate.x+18, pixelCoordinate.y+size.y/2-10);

    // surround bitmap with a black border
    // ctx.strokeStyle = 'black';
    // ctx.lineWidth = 5;
    // ctx.strokeRect(pixelCoordinate.x-size.x/2, pixelCoordinate.y-size.y/2, size.x, size.y);        
}
