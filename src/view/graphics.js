'use strict';

import { hexOf, hex_to_pixel } from "../lib/hexlib.js";
import { layout } from "./map.js";
import { Point } from "../lib/hexlib.js";
import { Side } from "../model/side.js";

export function drawUnit(graphics, pixelCoordinate, unit, unitStrength, isSelected) {
    function displayStrength() {
        if (unitStrength <= 0) return 'X';
        return unitStrength.toString();
    }

    let url = `images/units/${unit.imageName}`;
    
    const size = graphics.drawImageCentered(url, pixelCoordinate);
    
    let shift = 2;
    const pixelStrength = pixelCoordinate.add(new Point(18, size.y / 2 - 10));
    const pixelStrengthShadow = pixelStrength.add(new Point(-shift, shift));
    graphics.writeText(displayStrength(), pixelStrengthShadow, "20pt Arial", "white");
    graphics.writeText(displayStrength(), pixelStrength, "16pt Arial", "black");

    if (isSelected) {
        let pixelTopLeft = pixelCoordinate.add(new Point(-size.x / 2, -size.y / 2));
        graphics.drawRect(pixelTopLeft, size.x, size.y, 5, 'red');
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

    // let newGameButton = document.getElementById("new-game");
    // newGameButton.disabled = !game.isTerminal();

    let aiContinueButton = document.getElementById("ai-continue");
    aiContinueButton.disabled = game.currentSide === Side.ROMAN || game.isTerminal();
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
function drawGraveyardHex(graphics, game, index, hex, unit) {
    const pixel = hex_to_pixel(layout, hex);
    graphics.drawCircle(pixel, layout.size.x * 0.7, 'darkgray');
    const adjustment = GRAVEYARD_ADJUSTMENTS[index];
    graphics.writeText(GRAVEYARD_LABELS[index], 
        pixel.add(new Point(adjustment, 10)), "30pt Times", "white");
    if (unit) {
        drawUnit(graphics, pixel, unit, 0, false);
    }
}

function drawGraveyardHexSouth(graphics, game, index, unit) {
    const hex = hexOf(-4 + index, 9)
    drawGraveyardHex(graphics, game, index, hex, unit);
}

function drawGraveyardHexNorth(graphics, game, index, unit) {
    const hex = hexOf(12 - index, -1)
    drawGraveyardHex(graphics, game, index, hex, unit);
}

function drawGraveyard(graphics, game) {    
    const graveyardSize = game.pointsToWin;
    for (let i = 0; i < graveyardSize; i++) {
        drawGraveyardHexSouth(graphics, game, i, game.deadUnitsNorth[i]);
        drawGraveyardHexNorth(graphics, game, i, game.deadUnitsSouth[i]);
    }
}

export function drawTextOnHex(graphics, text, hex) {
    const pixel = hex_to_pixel(layout, hex);
    graphics.writeText(text, pixel, "14pt Times");
}

export function redraw(graphics, game) {
    graphics.drawImage('images/cca_map_hq.jpg', new Point(0, 0));

    game.foreachHex(hex => drawCoordinates(graphics, hex));

    drawMovementTrails(graphics, layout, game);

    game.hilightedHexes.forEach(hex => {
        let pixelCoordinate = hex_to_pixel(layout, hex);
        graphics.hilightHex(layout.size, pixelCoordinate);
    });

    game.foreachUnit((unit, hex) => {
        let pixelCoordinate = hex_to_pixel(layout, hex);
        drawUnit(graphics, pixelCoordinate, unit, game.unitStrength(unit), unit === game.selectedUnit());
    });

    drawGraveyard(graphics, game);

    updateInfoMessage(game);
    enableButtons(game);
}

