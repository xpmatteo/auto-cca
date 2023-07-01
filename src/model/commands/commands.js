import { RESULT_FLAG } from "../dice.js";

const DISTANCE_VALUE_BACKOFF = 0.2;

/*
    Commands are immutable objects representing the actions that can be taken by the player. 
    They are used by both the human player and the AI to execute a move.
*/

export function hexScore(enemyUnitStrength) {
    return 1000 / enemyUnitStrength;
}

function valueOfHex(hexToBeEvaluated, enemyUnitHex, enemyUnitStrength) {
    const distance = enemyUnitHex.distance(hexToBeEvaluated);
    return hexScore(enemyUnitStrength) * Math.pow(DISTANCE_VALUE_BACKOFF, distance);
}

export function valueOfHexOverAllEnemyUnits(game, hexToBeEvaluated, friendlySide) {
    let bestValue = -Infinity;
    game.foreachUnit((otherUnit, otherUnitHex) => {
        if (otherUnit.side === friendlySide) {
            return;
        }
        const candidateBest = valueOfHex(otherUnitHex, hexToBeEvaluated, game.unitStrength(otherUnit));
        if (candidateBest > bestValue) {
            bestValue = candidateBest;
        }
    });
    return bestValue;
}


export class FlagResult {
    constructor(damage, retreats) {
        this.damage = damage;
        this.retreats = retreats;
    }

    static NO_EFFECT = new FlagResult(0, 0);

    toString() {
        return `FlagResult(damage: ${this.damage}, retreat: ${this.retreats})`;
    }

    static retreat(number) {
        return new FlagResult(0, number);
    }

    static damage(number) {
        return new FlagResult(number, 0);
    }
}

export function handleFlags(diceResults, ignorableFlags, retreatPathLength) {
    const flags = diceResults.filter(d => d === RESULT_FLAG).length - ignorableFlags;
    const damage = flags - retreatPathLength;
    const retreats = flags - damage;
    return new FlagResult(damage, retreats);
}
