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
        // This depends on the order of the events generated by the close combat command.
        // If the order changes, this will break and no test is protecting us
        if (decorationsList[0] instanceof BattleBackEvent && decorationsList[1] instanceof DamageEvent) {
            // merge the two events with this one
            const mutualDamageEvent = new MutualDamageEvent(
                decorationsList[1].defendingUnit,
                decorationsList[1].damage,
                this.defendingUnit,
                this.damage
            );
            decorationsList.splice(0, 2, mutualDamageEvent);
            return;
        }

        // remove any previous damage events
        for (let i = 0; i < decorationsList.length; i++) {
            if (decorationsList[i] instanceof DamageEvent || decorationsList[i] instanceof MutualDamageEvent) {
                decorationsList.splice(i, 1);
                break;
            }
        }

        decorationsList.unshift(this);
    }

    draw(graphics, game) {
        drawDamage(graphics, game, this.defendingUnit, this.damage);

        const attackerHex = game.hexOfUnit(this.attackingUnit);
        if (attackerHex) {
            let pixel = hex_to_pixel(layout, attackerHex);
            graphics.drawImageCentered('images/icons/attacker.png', pixel);
        }
    }
}

function drawDamage(graphics, game, unit, damage) {
    const hex = game.hexOfUnit(unit);
    if (hex) {
        let pixel = hex_to_pixel(layout, hex);
        graphics.drawCircle(pixel, 20, 'blue');
        graphics.writeText(damage, pixel.add(new Point(-12, 18)), '30pt Arial', 'white');
    }
}

/*
    This event is not generated by combat command, but by logic in the DamageEvent class.
 */
export class MutualDamageEvent {
    constructor(unit0, damage0, unit1, damage1) {
        this.unit0 = unit0;
        this.damage0 = damage0;
        this.unit1 = unit1;
        this.damage1 = damage1;
    }

    draw(graphics, game) {
        drawDamage(graphics, game, this.unit0, this.damage0);
        drawDamage(graphics, game, this.unit1, this.damage1);
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

    addDecorations(decorationsList) {
        decorationsList.unshift(this);
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

