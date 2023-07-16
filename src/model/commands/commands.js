const DISTANCE_VALUE_BACKOFF = 0.2;

// Optimization: precompute the values for the backoff function
function backoffValues(number) {
    let values = [];
    for (let i = 0; i < number; i++) {
        values.push(Math.pow(DISTANCE_VALUE_BACKOFF, i));
    }
    return values;
}
const BACKOFF_VALUES = backoffValues(17);

/*
    Commands are immutable objects representing the actions that can be taken by the player. 
    They are used by both the human player and the AI to execute a move.
*/

export function hexScore(enemyUnitStrength) {
    return 1000 / enemyUnitStrength;
}

function valueOfHex(hexToBeEvaluated, enemyUnitHex, enemyUnitStrength) {
    const distance = enemyUnitHex.distance(hexToBeEvaluated);
    return hexScore(enemyUnitStrength) * BACKOFF_VALUES[distance];
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
    constructor(damage, retreatHexes) {
        this.damage = damage;
        this.retreats = retreatHexes;
    }

    static NO_EFFECT = new FlagResult(0, []);

    toString() {
        return `FlagResult(damage: ${this.damage}, retreatHexes: ${this.retreats})`;
    }

    static retreat(hexes) {
        return new FlagResult(0, hexes);
    }

    static damage(number) {
        return new FlagResult(number, []);
    }
}

function handleFlagsNonIgnorable(flags, retreatHexesPerFlag, retreatPaths) {
    const requiredRetreat = flags * retreatHexesPerFlag;
    if (retreatPaths.maxDistance < requiredRetreat) {
        let damage = requiredRetreat - retreatPaths.maxDistance;
        let paths = retreatPaths.maxDistance === 0 ? [] : retreatPaths[retreatPaths.maxDistance];
        return new FlagResult(damage, paths)
    }
    return new FlagResult(0, retreatPaths[requiredRetreat]);
}

export function handleFlags(flags, retreatHexesPerFlag, ignorableFlags, retreatPaths) {
    if (flags === 0) {
        return FlagResult.NO_EFFECT;
    }

    if (ignorableFlags === 0) {
        return handleFlagsNonIgnorable(flags, retreatHexesPerFlag, retreatPaths);
    }
}
