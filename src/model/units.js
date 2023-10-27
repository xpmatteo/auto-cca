import { hasLineOfSight } from "../lib/hexlib.js";
import * as dice from './dice.js';
import { Side } from './side.js';

export class Unit {
    isLightFootUnit = false;
    movement = 1;

    get retreatHexes() {
        return this.movement;
    }

    validDestinations(fromHex, game) {
        if (game.currentCard && game.currentCard.allowsLightFootMovementThroughFriendlies && this.isLightFootUnit) {
            return this.__validDestinationsPassingThroughFriendlies(fromHex, game);
        }
        return this.__validDestinations(fromHex, game);
    }

    __validDestinations(fromHex, game) {
        let seed = new Set([fromHex]);
        let result = new Set();
        for (let i = 0; i < this.movement; i++) {
            let newSeed = new Set();
            seed.forEach(hex => {
                const next = game.subtractOccupiedHexes(game.neighbors(hex));
                next.forEach(hex => newSeed.add(hex));
            });
            newSeed.forEach(hex => result.add(hex));
            seed = newSeed;
        }
        return Array.from(result);
    }

    __validDestinationsPassingThroughFriendlies(fromHex, game) {
        let seed = new Set([fromHex]);
        let result = new Set();
        for (let i = 0; i < this.movement; i++) {
            let newSeed = [];
            seed.forEach(hex => {
                const next = game.subtractEnemyOccupiedHexes(game.neighbors(hex), this.side);
                newSeed.push(...next);
            });
            game.subtractOccupiedHexes(newSeed).forEach(hex => result.add(hex));
            seed = newSeed;
        }
        return Array.from(result);
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
        board.foreachUnit((otherUnit, toHex) => {
            if (otherUnit.side !== this.side) {
                const distance = fromHex.distance(toHex);
                if (distance >= 2 && distance <= this.range && hasLineOfSight(toHex, fromHex)) {
                    targets.push(toHex);
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
    acronym = "HC";
    weight = dice.RESULT_HEAVY;
    diceCount = 4;
    initialStrength = 3;
    movement = 2;

    toString() {
        return `${this.side.name} heavy cavalry`;
    }
}

class MediumCavalry extends Unit {
    acronym = "MC";
    weight = dice.RESULT_MEDIUM;
    diceCount = 3;
    initialStrength = 3;
    movement = 3;

    toString() {
        return `${this.side.name} medium cavalry`;
    }
}

class LightCavalry extends Unit {
    acronym = "LC";
    weight = dice.RESULT_LIGHT;
    diceCount = 2;
    initialStrength = 3;
    movement = 4;
    range = 2;

    toString() {
        return `${this.side.name} light cavalry`;
    }
}
class HeavyChariot extends Unit {
    acronym = "HCH";
    weight = dice.RESULT_HEAVY;
    diceCount = 4;
    initialStrength = 2;
    movement = 2;

    toString() {
        return `${this.side.name} heavy chariot`;
    }
}

class HeavyInfantry extends Unit {
    acronym = "H";
    weight = dice.RESULT_HEAVY;
    diceCount = 5;
    initialStrength = 4;
    movement = 1;

    toString() {
        return `${this.side.name} heavy infantry`;
    }
}

class MediumInfantry extends Unit {
    acronym = "M";
    weight = dice.RESULT_MEDIUM;
    diceCount = 4;
    initialStrength = 4;
    movement = 1;

    toString() {
        return `${this.side.name} medium infantry`;
    }
}

class AuxiliaInfantry extends Unit {
    acronym = "A";
    weight = dice.RESULT_LIGHT;
    diceCount = 3;
    initialStrength = 4;
    movement = 2;
    range = 2;
    isLightFootUnit = true;
    retreatHexes = 1;

    toString() {
        return `${this.side.name} auxilia`;
    }

    validRangedCombatTargets(fromHex, game) {
        if (game.unitDistanceMoved(fromHex) > 1) {
            return [];
        }
        return super.validRangedCombatTargets(fromHex, game);
    }

    validCloseCombatTargets(fromHex, game) {
        if (game.unitDistanceMoved(fromHex) > 1) {
            return [];
        }
        return super.validCloseCombatTargets(fromHex, game);
    }
}

class LightInfantry extends Unit {
    acronym = "L";
    weight = dice.RESULT_LIGHT;
    diceCount = 2;
    initialStrength = 4;
    movement = 2;
    range = 2;
    isLightFootUnit = true;

    toString() {
        return `${this.side.name} light infantry`;
    }
}

class LightBowsInfantry extends Unit {
    acronym = "LB";
    weight = dice.RESULT_LIGHT;
    diceCount = 2;
    initialStrength = 4;
    movement = 2;
    range = 3;
    isLightFootUnit = true;

    toString() {
        return `${this.side.name} light infantry`;
    }
}

export class RomanHeavyCavalry extends HeavyCavalry {
    imageName = 'rom_cav_hv.png';
    side = Side.ROMAN;
}

export class RomanMediumCavalry extends MediumCavalry {
    imageName = 'rom_cav_md.png';
    side = Side.ROMAN;
}

export class RomanLightCavalry extends LightCavalry {
    imageName = 'rom_cav_lt.png';
    side = Side.ROMAN;
}

export class RomanHeavyInfantry extends HeavyInfantry {
    imageName = 'rom_inf_hv.png';
    side = Side.ROMAN;
}

export class RomanMediumInfantry extends MediumInfantry {
    imageName = 'rom_inf_md.png';
    side = Side.ROMAN;
}

export class RomanAuxiliaInfantry extends AuxiliaInfantry {
    imageName = 'rom_aux.png';
    side = Side.ROMAN;
}

export class RomanLightInfantry extends LightInfantry {
    imageName = 'rom_inf_lt.png';
    side = Side.ROMAN;
}

export class RomanLightBowsInfantry extends LightBowsInfantry {
    imageName = 'rom_inf_lt_bow.png';
    side = Side.ROMAN;
}

export class CarthaginianHeavyCavalry extends HeavyCavalry {
    imageName = 'car_cav_hv.png';
    side = Side.CARTHAGINIAN;
}

export class CarthaginianMediumCavalry extends MediumCavalry {
    imageName = 'car_cav_md.png';
    side = Side.CARTHAGINIAN;
}

export class CarthaginianLightCavalry extends LightCavalry {
    imageName = 'car_cav_lt.png';
    side = Side.CARTHAGINIAN;
}

export class CarthaginianHeavyChariot extends HeavyChariot {
    imageName = 'car_char.png';
    side = Side.CARTHAGINIAN;
}

export class CarthaginianHeavyInfantry extends HeavyInfantry {
    imageName = 'car_inf_hv.png';
    side = Side.CARTHAGINIAN;
}

export class CarthaginianMediumInfantry extends MediumInfantry {
    imageName = 'car_inf_md.png';
    side = Side.CARTHAGINIAN;
}

export class CarthaginianAuxiliaInfantry extends AuxiliaInfantry {
    imageName = 'car_aux.png';
    side = Side.CARTHAGINIAN;
}

export class CarthaginianLightInfantry extends LightInfantry {
    imageName = 'car_inf_lt.png';
    side = Side.CARTHAGINIAN;
}

export class CarthaginianLightBowsInfantry extends LightBowsInfantry {
    imageName = 'car_inf_lt_bow.png';
    side = Side.CARTHAGINIAN;
}
