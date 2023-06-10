'use strict';

import { hex_to_pixel } from "../lib/hexlib.js";
import { IMAGES } from "./load_all_images.js";
import { layout } from "./map.js";

export function draw_unit(ctx, pixelCoordinate, unit, isSelected) {
    let url = `images/units/${unit.imageName}`;
    let img = IMAGES[url];
    if (!img) {
        throw new Error(`Image ${url} not found`);
    }
    let shift = 2;
    ctx.drawImage(img, pixelCoordinate.x - img.width / 2, pixelCoordinate.y - img.height / 2, img.width, img.height);
    ctx.font = "20pt Arial";
    ctx.fillStyle = "white";
    ctx.fillText(unit.strength, pixelCoordinate.x + 18 -shift, pixelCoordinate.y + img.height / 2 - 10 +shift);

    ctx.font = "16pt Arial";
    ctx.fillStyle = "black";
    ctx.fillText(unit.strength, pixelCoordinate.x + 18, pixelCoordinate.y + img.height / 2 - 10);

    if (isSelected) {
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 5;
        ctx.strokeRect(pixelCoordinate.x - img.width / 2, pixelCoordinate.y - img.height / 2, img.width, img.height);
    }
}

function drawMovementTrails(graphics, layout, game) {
    game.movementTrails.forEach(trail => {
        drawMovementTrail(graphics, layout, trail.from, trail.to);
    });
}

function drawMovementTrail(graphics, layout, hexFrom, hexTo) {
    const TRAIL_COLOR = 'darkgray';
    let pixelFrom = hex_to_pixel(layout, hexFrom);
    let pixelTo = hex_to_pixel(layout, hexTo);
        
    graphics.drawCircle(pixelFrom, 10, TRAIL_COLOR);
    
    // draw thick gray line from hexFrom to hexTo
    graphics.drawLine(pixelFrom, pixelTo, 10, TRAIL_COLOR);
}

function enableButtons(game) {
    let endTurnButton = document.getElementById("end-phase");
    endTurnButton.disabled = game.isTerminal();

    let newGameButton = document.getElementById("new-game");
    newGameButton.disabled = !game.isTerminal();
}

function updateInfoMessage(game) {
    let info = document.getElementById("info");    
    if (game.isTerminal()) {
        info.innerHTML = `Game over. ${game.gameStatus}`;    
    } else {
        info.innerHTML = game.currentPhaseName;
    }
}

export function redraw(ctx, graphics, game) {
    let mapImage = IMAGES['images/cca_map_hq.jpg'];
    ctx.drawImage(mapImage, 0, 0, mapImage.width, mapImage.height);

    function draw_coordinates(hex) {
        ctx.font = "12pt Arial";
        ctx.fillStyle = "black";
        let pixelCoordinate = hex_to_pixel(layout, hex);
        ctx.fillText(`${hex.q}, ${hex.r}`, pixelCoordinate.x-12, pixelCoordinate.y-20);        
    }

    function hilight(hex) {
        let pixelCoordinate = hex_to_pixel(layout, hex);
        graphics.hilightHex(layout.size, pixelCoordinate);
    }

    game.foreachHex(draw_coordinates);

    drawMovementTrails(graphics, layout, game);

    game.foreachUnit((unit, hex) => {
        let pixelCoordinate = hex_to_pixel(layout, hex);
        draw_unit(ctx, pixelCoordinate, unit, unit === game.selectedUnit());
    });

    game.hilightedHexes.forEach(hilight);

    updateInfoMessage(game);
    enableButtons(game);
}

