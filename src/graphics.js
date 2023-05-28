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

export function draw_unit(ctx, pixelCoordinate, unit) {
    let url = `images/units/${unit.imageName}`;
    let img = IMAGES[url];
    if (!img) {
        throw new Error(`Image ${url} not found`);
    }
    ctx.drawImage(img, pixelCoordinate.x - img.width / 2, pixelCoordinate.y - img.height / 2, img.width, img.height);
    ctx.font = "16pt Arial";
    ctx.fillStyle = "black";
    ctx.fillText("4", pixelCoordinate.x + 18, pixelCoordinate.y + img.height / 2 - 10);

    if (unit.isSelected) {
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 5;
        ctx.strokeRect(pixelCoordinate.x - img.width / 2, pixelCoordinate.y - img.height / 2, img.width, img.height);
    }
}

// highlight the hexagon at the given pixel coordinate
export function highlight_hex(ctx, layout, pixelCoordinate) {
    ctx.save();
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = 'lightgreen';
    ctx.beginPath();
    let x = layout.size.x-10;
    let y = layout.size.y-2;
    ctx.moveTo(pixelCoordinate.x, pixelCoordinate.y);
    ctx.lineTo(pixelCoordinate.x, pixelCoordinate.y - y);
    ctx.lineTo(pixelCoordinate.x + x, pixelCoordinate.y - y / 2);
    ctx.lineTo(pixelCoordinate.x + x, pixelCoordinate.y + y / 2);
    ctx.lineTo(pixelCoordinate.x, pixelCoordinate.y + y);
    ctx.lineTo(pixelCoordinate.x - x, pixelCoordinate.y + y / 2);
    ctx.lineTo(pixelCoordinate.x - x, pixelCoordinate.y - y / 2);
    ctx.lineTo(pixelCoordinate.x, pixelCoordinate.y - y);
    ctx.fill();
    ctx.closePath();
    ctx.restore();
}
