import { Side } from './side.js';
import * as dice from './dice.js';

function toRoman(number) {
    switch (number) {
        case 1: return 'I';
        case 2: return 'II';
        case 3: return 'III';
        case 4: return 'IV';
        case 5: return 'V';
        case 6: return 'VI';
        case 7: return 'VII';
        case 8: return 'VIII';
        case 9: return 'IX';
        case 10: return 'X';
        default: return number;
    }
}

export class Unit {
    isDead() {
        return this.strength <= 0;
    }

    displayStrength() {
        return toRoman(this.strength);
    }

    validDestinations(fromHex, board) {
        let hexes = board.subtractOffMap(fromHex.neighbors());
        return board.subtractOccupiedHexes(hexes);
    }

    validCloseCombatTargets(fromHex, board) {
        let targets = [];
        let hexes = board.subtractOffMap(fromHex.neighbors());
        hexes.forEach(hex => {
            let unit = board.unitAt(hex);
            if (unit && unit.side !== this.side) {
                targets.push(hex);
            }
        });
        return targets;
    }

    takeDamage(diceResults, includeFlags = false) {
        const damage = diceResults.
            filter(r => r === this.weight 
                || r === dice.RESULT_SWORDS 
                || (includeFlags && r == dice.RESULT_FLAG)
                ).
            length;
        this.strength -= damage;
        return damage;
    }
}

class HeavyInfantry extends Unit {
    diceCount = 5;
    weight = dice.RESULT_HEAVY;
    strength = 4;

    toString() {
        return `${this.side.name} heavy infantry`;
    }
}


class MediumInfantry extends Unit {
    diceCount = 4;
    weight = dice.RESULT_MEDIUM;
    strength = 4;

    toString() {
        return `${this.side.name} medium infantry`;
    }
}

export class RomanHeavyInfantry extends HeavyInfantry {
    imageName = 'rom_inf_hv.png';
    side = Side.ROMAN;
}

export class RomanMediumInfantry extends MediumInfantry {
    imageName = 'rom_inf_md.png';
    side = Side.ROMAN;
}

export class CarthaginianHeavyInfantry extends HeavyInfantry {
    imageName = 'car_inf_hv.png';
    side = Side.CARTHAGINIAN;
}

export class CarthaginianMediumInfantry extends MediumInfantry {
    imageName = 'car_inf_md.png';
    side = Side.CARTHAGINIAN;
}