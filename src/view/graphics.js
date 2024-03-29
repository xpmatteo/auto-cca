import { scoreMcts } from "../ai/score.js";
import { CARD_IMAGE_SIZE } from "../config.js";
import { hex_to_pixel, hexOf, Point } from "../lib/hexlib.js";
import { Game } from "../model/game.js";
import { GraphicalContext } from "./graphical_context.js";
import { layout, MAP_HEIGHT, MAP_WIDTH } from "./map.js";

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
    endPhaseButton["disabled"] = game.isTerminal() || game.currentPhase.constructor.name === "PlayCardPhase";

    let aiContinueButton = document.getElementById("ai-continue");
    aiContinueButton["disabled"] = game.currentSide === game.sideSouth || game.isTerminal();
}

/**
 * @param {Game} game
 */
function updateInfoMessage(game) {
    let info = document.getElementById("info");
    info.innerHTML = game.describeCurrentPhase();
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
        drawCardInHand(graphics, i, game.handSouth.at(i));
    }
    erasePlayedCard(graphics, game.handSouth.length);
}

function drawCurrentCard(graphics, game) {
    const pixel = new Point(MAP_WIDTH, 0);
    if (game.currentCard) {
        graphics.drawImage(game.currentCard.url, pixel)
    } else {
        graphics.fillRect(pixel, CARD_IMAGE_SIZE.x, CARD_IMAGE_SIZE.y+20, 'white')
    }
}

function drawDecorationsOnTopOfUnits(graphics, game) {
    game.decorations.forEach(decoration => {
        if (decoration.drawOnTopOfUnits())
            decoration.draw(graphics, game);
    });
}

function drawDecorationsUnderUnits(graphics, game) {
    game.decorations.forEach(decoration => {
        if (!decoration.drawOnTopOfUnits) {
            console.log("Decoration does not have drawOnTopOfUnits method: " + decoration.constructor.name);
        }
        if (!decoration.drawOnTopOfUnits())
            decoration.draw(graphics, game);
    });
}

/**
 * @param {GraphicalContext} graphics
 * @param {Game} game
 */
function drawScores(graphics, game) {
    const label = "Score: ";
    const scoreNorth = scoreMcts(game.toGame(), game.toGame().scenario.sideNorth).toFixed(1);
    const scoreSouth = scoreMcts(game.toGame(), game.toGame().scenario.sideSouth).toFixed(1);
    graphics.writeText(label + scoreNorth, new Point(100, 150), "20pt Arial");
    graphics.writeText(label + scoreSouth, new Point(100, 1080), "20pt Arial");
}

export function redraw(graphics, game) {
    graphics.drawImage('images/cca_map_hq.jpg', new Point(0, 0));

    drawMovementTrails(graphics, layout, game);

    game.hilightedHexes.forEach(hex => {
        let pixelCoordinate = hex_to_pixel(layout, hex);
        graphics.hilightHex(layout.size, pixelCoordinate);
    });
    game.foreachHex(hex => drawCoordinates(graphics, hex));

    drawDecorationsUnderUnits(graphics, game);

    game.foreachUnit((unit, hex) => {
        let pixelCoordinate = hex_to_pixel(layout, hex);
        drawUnit(graphics, pixelCoordinate, unit,
            game.unitStrength(unit), unit === game.selectedUnit(), game.isOrdered(unit));
    });

    drawGraveyard(graphics, game);
    drawPlayerHand(graphics, game);
    drawCurrentCard(graphics, game);
    drawDecorationsOnTopOfUnits(graphics, game);
    updateInfoMessage(game.toGame());
    enableButtons(game);
    drawScores(graphics, game)
}

