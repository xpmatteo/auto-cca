'use strict';

import { hex_to_pixel, hexOf, Point } from "../lib/hexlib.js";
import { layout, MAP_HEIGHT, MAP_WIDTH } from "./map.js";
import { CARD_IMAGE_SIZE } from "../model/cards.js";

export function drawUnit(graphics, pixelCoordinate, unit, unitStrength, isSelected, isOrdered) {
    function displayStrength() {
        if (unitStrength <= 0) return 'X';
        return unitStrength.toString();
    }

    if (isOrdered) {
        graphics.drawEllipse(pixelCoordinate.add(new Point(0, 25)), 65, 30, '#777777');
    }

    let url = `images/units/${unit.imageName}`;
    const size = graphics.drawImageCentered(url, pixelCoordinate);
    
    let shift = 2;
    const pixelStrength = pixelCoordinate.add(new Point(size.x/2 - 30, size.y / 2 - 10));
    const pixelStrengthShadow = pixelStrength.add(new Point(-shift, shift));
    graphics.writeText(displayStrength(), pixelStrengthShadow, "20pt Arial", "white");
    graphics.writeText(displayStrength(), pixelStrength, "16pt Arial", "black");

    const pixelAcronym = pixelCoordinate.add(new Point(- size.x / 2 + 6, - size.y / 2 + 32));
    graphics.writeText(unit.acronym, pixelAcronym, "14pt Arial", "black");

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
    let endPhaseButton = document.getElementById("end-phase");
    endPhaseButton.disabled = game.isTerminal();

    let aiContinueButton = document.getElementById("ai-continue");
    aiContinueButton.disabled = game.currentSide === game.sideSouth || game.isTerminal();
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
    let pixelCoordinate = hex_to_pixel(layout, hex).add(new Point(-12, -50));
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

function drawCardInHand(graphics, position, card) {
    const pixel = new Point(position * (CARD_IMAGE_SIZE.x), MAP_HEIGHT);
    graphics.drawImage(card.url, pixel)
}

function erasePlayedCard(graphics, position) {
    const pixel = new Point(position * (CARD_IMAGE_SIZE.x), MAP_HEIGHT);
    graphics.fillRect(pixel, CARD_IMAGE_SIZE.x, CARD_IMAGE_SIZE.y, 'white')
}

function drawPlayerHand(graphics, game) {
    for (let i = 0; i < game.handSouth.length; i++) {
        drawCardInHand(graphics, i, game.handSouth[i]);
    }
    erasePlayedCard(graphics, game.handSouth.length);
}

function drawCurrentCard(graphics, game) {
    if (game.currentCard) {
        const pixel = new Point(MAP_WIDTH, 0);
        graphics.drawImage(game.currentCard.url, pixel)
    }
}

export function redraw(graphics, game) {
    graphics.drawImage('images/cca_map_hq.jpg', new Point(0, 0));

    drawMovementTrails(graphics, layout, game);

    game.hilightedHexes.forEach(hex => {
        let pixelCoordinate = hex_to_pixel(layout, hex);
        graphics.hilightHex(layout.size, pixelCoordinate);
    });
    game.foreachHex(hex => drawCoordinates(graphics, hex));

    game.foreachUnit((unit, hex) => {
        let pixelCoordinate = hex_to_pixel(layout, hex);
        drawUnit(graphics, pixelCoordinate, unit,
            game.unitStrength(unit), unit === game.selectedUnit(), game.isOrdered(unit));
    });

    drawGraveyard(graphics, game);
    drawPlayerHand(graphics, game);
    drawCurrentCard(graphics, game);
    updateInfoMessage(game);
    enableButtons(game);
}

