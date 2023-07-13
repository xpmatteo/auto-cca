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

export function handleFlags(flags, retreatHexesPerFlag, ignorableFlags, retreatPaths) {
    if (flags === 0) {
        return FlagResult.NO_EFFECT;
    }
    let retreatMin = (flags - ignorableFlags) * retreatHexesPerFlag;
    let retreatMax = flags * retreatHexesPerFlag;
    console.log(`handleFlags: retreatMin: ${retreatMin}, retreatMax: ${retreatMax}, retreatAvailable: ${(retreatPaths.maxDistance)}`);

    if (retreatMin >= retreatPaths.maxDistance) {
        // damage and possibly retreat; no choice except retreat as much as possible
        let damage = retreatMax - retreatPaths.maxDistance;
        let retreatHexes = retreatPaths.maxDistance === 0 ? [] : retreatPaths[retreatPaths.maxDistance];
        console.log("handleFlags: case (1)");
        return new FlagResult(damage, retreatHexes);
    }
    if (retreatMax > retreatPaths.maxDistance) {
        console.log("handleFlags: case (2)");
        return new FlagResult(0, []);
    }

    // no damage -- just retreat
    if (ignorableFlags === 0) {
        let retreatHexes = retreatPaths.maxDistance === 0 ? [] : retreatPaths[retreatPaths.maxDistance];
        console.log("handleFlags: case (3)");
        return new FlagResult(0, retreatHexes);
    }
    let retreatHexes;
    if (retreatPaths.maxDistance === 0) {
        retreatHexes = [];
    } else {
        retreatHexes = retreatPaths[retreatMin].concat(retreatPaths[retreatPaths.maxDistance]);
    }
    console.log("handleFlags: case (4)");
    return new FlagResult(0, retreatHexes);
}
