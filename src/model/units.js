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
    #imageName;
    #side;
    #strength = 4;

    constructor(imageName, side) {
        this.#imageName = imageName;
        this.#side = side;
    }

    get imageName() {
        return this.#imageName;
    }

    get side() {
        return this.#side;
    }

    get strength() {
        return this.#strength;
    }

    isDead() {
        return this.#strength <= 0;
    }

    displayStrength() {
        return toRoman(this.#strength);
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

    diceCount() {
        return 5;
    }

    takeDamage(diceResults) {
        const damage = diceResults.
            filter(r => r === dice.RESULT_HEAVY || r === dice.RESULT_SWORDS).
            length;
        this.#strength -= damage;
        return damage;
    }

    toString() {
        return `${this.side} heavy infantry`;
    }
}


export class RomanHeavyInfantry extends Unit {
    constructor() {
        super('rom_inf_hv.png', Side.ROMAN);
    }
}

export class CarthaginianHeavyInfantry extends Unit {
    constructor() {
        super('car_inf_hv.png', Side.CARTHAGINIAN);
    }
}