'use strict';

import { hex_to_pixel } from "../lib/hexlib.js";
import { IMAGES } from "./load_all_images.js";
import { layout } from "./map.js";
import { Point } from "../lib/hexlib.js";

export function drawUnit(ctx, graphics, pixelCoordinate, unit, isSelected) {
    let url = `images/units/${unit.imageName}`;
    let img = IMAGES[url];
    if (!img) {
        throw new Error(`Image ${url} not found`);
    }
    let shift = 2;
    ctx.drawImage(img, pixelCoordinate.x - img.width / 2, pixelCoordinate.y - img.height / 2, img.width, img.height);

    const pixelStrength = pixelCoordinate.add(new Point(18, img.height / 2 - 10));
    const pixelStrengthShadow = pixelStrength.add(new Point(-shift, shift));
    graphics.writeText(unit.strength, pixelStrengthShadow, "20pt Arial", "white");
    graphics.writeText(unit.strength, pixelStrength, "16pt Arial", "black");

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

function drawCoordinates(graphics, hex) {
    let pixelCoordinate = hex_to_pixel(layout, hex).add(new Point(-12, -20));
    const text = `${hex.q}, ${hex.r}`;
    graphics.writeText(text, pixelCoordinate);
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

    updateInfoMessage(game);
    enableButtons(game);
}

