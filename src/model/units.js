import { Side } from './side.js';
import * as dice from './dice.js';

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