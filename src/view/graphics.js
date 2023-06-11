'use strict';

import { hexOf, hex_to_pixel } from "../lib/hexlib.js";
import { IMAGES } from "./load_all_images.js";
import { layout } from "./map.js";
import { Point } from "../lib/hexlib.js";
import { RomanHeavyInfantry } from "../model/units.js";

export function drawUnit(ctx, graphics, pixelCoordinate, unit, isSelected) {
    let url = `images/units/${unit.imageName}`;
    let img = IMAGES[url];
    if (!img) {
        throw new Error(`Image ${url} not found`);
    }
    ctx.drawImage(img, pixelCoordinate.x - img.width / 2, pixelCoordinate.y - img.height / 2, img.width, img.height);
    
    let shift = 2;
    const pixelStrength = pixelCoordinate.add(new Point(18, img.height / 2 - 10));
    const pixelStrengthShadow = pixelStrength.add(new Point(-shift, shift));
    graphics.writeText(unit.strength, pixelStrengthShadow, "20pt Arial", "white");
    graphics.writeText(unit.strength, pixelStrength, "16pt Arial", "black");

    if (isSelected) {
        let pixelTopLeft = pixelCoordinate.add(new Point(-img.width / 2, -img.height / 2));
        graphics.drawRect(pixelTopLeft, img.width, img.height, 5, 'red');
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

function drawCoordinates(graphics, hex) {
    let pixelCoordinate = hex_to_pixel(layout, hex).add(new Point(-12, -20));
    const text = `${hex.q}, ${hex.r}`;
    graphics.writeText(text, pixelCoordinate);
}



const GRAVEYARD_LABELS = ['I', 'II', 'III', 'IV', 'V', 'VI'];
const GRAVEYARD_ADJUSTMENTS = [-7, -12, -18, -18, -12, -18];
function drawGraveyardHex(ctx, graphics, game, index, hex) {
    const pixel = hex_to_pixel(layout, hex);
    graphics.drawCircle(pixel, layout.size.x * 0.7, 'lightyellow');
    const adjustment = GRAVEYARD_ADJUSTMENTS[index];
    graphics.writeText(GRAVEYARD_LABELS[index], 
        pixel.add(new Point(adjustment, 10)), "30pt Times", "black");

    //drawUnit(ctx, graphics, pixel, new RomanHeavyInfantry(), false);
}

function drawGraveyardHexLow(ctx, graphics, game, index) {
    const hex = hexOf(-4 + index, 9)
    drawGraveyardHex(ctx, graphics, game, index, hex);
}

function drawGraveyardHexHigh(ctx, graphics, game, index) {
    const hex = hexOf(12 - index, -1)
    drawGraveyardHex(ctx, graphics, game, index, hex);
}

function drawGraveyard(ctx, graphics, game) {    
    const graveyardSize = 3;
    for (let i = 0; i < graveyardSize; i++) {
        drawGraveyardHexLow(ctx, graphics, game, i);
    }
    for (let i = 0; i < graveyardSize; i++) {
        drawGraveyardHexHigh(ctx, graphics, game, i);
    }
    
}

export function redraw(ctx, graphics, game) {
    graphics.drawImage('images/cca_map_hq.jpg', new Point(0, 0));

    game.foreachHex(hex => drawCoordinates(graphics, hex));

    drawMovementTrails(graphics, layout, game);

    game.foreachUnit((unit, hex) => {
        let pixelCoordinate = hex_to_pixel(layout, hex);
        drawUnit(ctx, graphics, pixelCoordinate, unit, unit === game.selectedUnit());
    });

    game.hilightedHexes.forEach(hex => {
        let pixelCoordinate = hex_to_pixel(layout, hex);
        graphics.hilightHex(layout.size, pixelCoordinate);
    });

    game.graveyard = [new RomanHeavyInfantry(), new RomanHeavyInfantry(), new RomanHeavyInfantry()];
    drawGraveyard(ctx, graphics, game);

    updateInfoMessage(game);
    enableButtons(game);
}

