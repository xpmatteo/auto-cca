import { hex_to_pixel, Point } from "../lib/hexlib.js";
import { layout } from "../view/map.js";

class GameEvent {
    addDecorations(decorationsList) {
    }

    draw(graphics, game) {
    }
}

export class DamageEvent extends GameEvent {
    constructor(attackingUnit, defendingUnit, hex, damage, diceResults) {
        super();
        this.attackingUnit = attackingUnit;
        this.defendingUnit = defendingUnit;
        this.hex = hex;
        this.damage = damage;
        this.diceResults = diceResults.slice();
    }

    toString() {        
        return `${this.attackingUnit} damages ${this.defendingUnit} at ${this.hex} for ${this.damage} damage with ${this.diceResults}`;
    }

    addDecorations(decorationsList) {
        decorationsList.push(this);
    }

    draw(graphics, game) {
        const defenderHex = game.hexOfUnit(this.defendingUnit);
        if (defenderHex) {
            let defenderPixel = hex_to_pixel(layout, defenderHex);
            graphics.drawCircle(defenderPixel, 20, 'blue');
            graphics.writeText(this.damage, defenderPixel.add(new Point(-12, 18)), '30pt Arial', 'white');
        }

        const attackerHex = game.hexOfUnit(this.attackingUnit);
        if (attackerHex) {
            let pixel = hex_to_pixel(layout, attackerHex);
            graphics.drawImageCentered('images/icons/attacker.png', pixel);
        }
    }
}

export class BattleBackEvent extends GameEvent {
    constructor(hexTo, hexFrom, diceCount) {
        super();
        this.hexTo = hexTo;
        this.hexFrom = hexFrom;
        this.diceCount = diceCount;
    }

    toString() {
        return `Battle back from ${this.hexFrom} to ${this.hexTo} with ${this.diceCount} dice`;
    }
}

export class UnitKilledEvent extends GameEvent {
    constructor(hex, unit) {
        super();
        this.unit = unit;
        this.hex = hex;
    }

    toString() {
        return `${this.unit} killed at ${this.hex}`;
    }

    addDecorations(decorationsList) {
        decorationsList.push(this);
    }

    draw(graphics) {
        let pixelCoordinate = hex_to_pixel(layout, this.hex);
        graphics.drawCross(pixelCoordinate, 20, 'red');
    }
}

export class FlagIgnoredEvent extends GameEvent {
    constructor(unit, hex) {
        super();
        this.unit = unit;
        this.hex = hex;
    }

    toString() {
        return `Flags ignored by ${this.unit} at ${this.hex}`;
    }
}

export class SideSwitchedTo extends GameEvent {
    constructor(currentSide) {
        super();
        this.currentSide = currentSide;
    }

    toString() {
        return `Now it's the ${this.currentSide.name} turn`;
    }

    addDecorations(decorationsList) {
        decorationsList.length = 0;
    }
}

