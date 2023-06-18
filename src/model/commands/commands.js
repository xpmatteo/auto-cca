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


