import { Side } from './side.js';
import * as dice from './dice.js';

export class Unit {
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

    validRangedCombatTargets(fromHex, board) {
        if (!this.canRangedCombat() || this.hasAdjacentEnemies(fromHex, board)) {
            return [];
        }
        let targets = [];
        board.foreachUnit((unit, hex) => {
            if (unit.side !== this.side) {
                if (fromHex.distance(hex) === 2) {
                    targets.push(hex);
                }
            }
        });
        return targets;
    }

    hasAdjacentEnemies(fromHex, board) {
        return this.validCloseCombatTargets(fromHex, board).length > 0;
    }

    canRangedCombat() {
        return this.weight === dice.RESULT_LIGHT;
    }

    takeDamage(diceResults, includeFlags = false, includeSwords = true) {
        if (typeof diceResults === 'number') {
            return diceResults;
        }

        const damage = diceResults.filter(
            r => r === this.weight
            || (includeSwords && r === dice.RESULT_SWORDS)
            || (includeFlags && r === dice.RESULT_FLAG)
        ).length;
        return damage;
    }
}

class HeavyCavalry extends Unit {
    weight = dice.RESULT_HEAVY;
    diceCount = 4;
    initialStrength = 3;
    movement = 2;

    toString() {
        return `${this.side.name} heavy cavalry`;
    }
}

class HeavyInfantry extends Unit {
    weight = dice.RESULT_HEAVY;
    diceCount = 5;
    initialStrength = 4;

    toString() {
        return `${this.side.name} heavy infantry`;
    }
}

class MediumInfantry extends Unit {
    weight = dice.RESULT_MEDIUM;
    diceCount = 4;
    initialStrength = 4;

    toString() {
        return `${this.side.name} medium infantry`;
    }
}

class LightInfantry extends Unit {
    weight = dice.RESULT_LIGHT;
    diceCount = 2;
    initialStrength = 4;

    toString() {
        return `${this.side.name} light infantry`;
    }
}

export class RomanHeavyCavalry extends HeavyCavalry {
    imageName = 'rom_cav_hv.png';
    side = Side.ROMAN;
}

export class RomanHeavyInfantry extends HeavyInfantry {
    imageName = 'rom_inf_hv.png';
    side = Side.ROMAN;

    constructor() {
        super();
        Object.freeze(this);
    }
}

export class RomanMediumInfantry extends MediumInfantry {
    imageName = 'rom_inf_md.png';
    side = Side.ROMAN;

    constructor() {
        super();
        Object.freeze(this);
    }
}

export class RomanLightInfantry extends LightInfantry {
    imageName = 'rom_inf_lt.png';
    side = Side.ROMAN;
}

export class CarthaginianHeavyInfantry extends HeavyInfantry {
    imageName = 'car_inf_hv.png';
    side = Side.CARTHAGINIAN;

    constructor() {
        super();
        Object.freeze(this);
    }
}

export class CarthaginianMediumInfantry extends MediumInfantry {
    imageName = 'car_inf_md.png';
    side = Side.CARTHAGINIAN;

    constructor() {
        super();
        Object.freeze(this);
    }
}