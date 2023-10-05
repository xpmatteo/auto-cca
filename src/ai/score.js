const SCORE_FOR_SUPPORTED_UNIT = 1;
const SCORE_FOR_EACH_DIE = 1;
const SCORE_FOR_POINT_OF_DAMAGE = 10;


export function scoreForDamageToEnemyUnit(game, unit) {
    const damage = unit.initialStrength - game.unitStrength(unit);
    return damage * SCORE_FOR_POINT_OF_DAMAGE;
}

export function scoreForCloseCombatDice(game, unit, hex) {
    let score = 0;
    unit.validCloseCombatTargets(hex, game).forEach(to => {
        score += unit.diceCount * SCORE_FOR_EACH_DIE;
    });
    return score;
}

export function scoreForRangedCombatDice(game, unit, hex) {
    let score = 0;
    unit.validRangedCombatTargets(hex, game).forEach(to => {
        score += (game.unitHasMoved(hex) ? 1 : 2) * SCORE_FOR_EACH_DIE;
    });
    return score;
}

export function scoreForUnitsWithSupport(game, hex) {
    let score = 0;
    if (game.isSupported(hex)) {
        score += SCORE_FOR_SUPPORTED_UNIT;
    }
    return score;
}

// Optimization: precompute the values for the backoff function
function backoffValues(number) {
    let values = [0];
    for (let i = 0; i < number; i++) {
        values.push(Math.pow(DISTANCE_VALUE_BACKOFF, i));
    }
    return values;
}
const DISTANCE_VALUE_BACKOFF = 0.2;
const SCORE_REDUCTION_FACTORS_BY_DISTANCE = backoffValues(17);
const ATTACK_PROXIMITY_SCORE_BY_ENEMY_STRENGTH = [undefined, 1000, 750, 500, 250];

/**
 * @param {Game} game
 * @param {Hex} hexToBeScored
 * @param {Side} attackingSide
 * @returns {number}
 */
export function attackProximityScoreForHex(game, hexToBeScored, attackingSide) {
    const defendingSide = game.opposingSide(attackingSide);
    let result = 0;
    game.foreachUnitOfSide(defendingSide, (unit, unitHex) => {
        const distance = hexToBeScored.distance(unitHex);
        result += ATTACK_PROXIMITY_SCORE_BY_ENEMY_STRENGTH[unit.initialStrength] *
            SCORE_REDUCTION_FACTORS_BY_DISTANCE[distance];
    });
    return result;
}


/**
 * @param {Game} game
 * @param {Side} side
 * @returns {number}
 */
export function score(game, side) {
    let score = 0;
    game.foreachUnit((unit, hex) => {
        if (unit.side === side) {
            score += scoreForUnitsWithSupport(game, hex);
            score += scoreForCloseCombatDice(game, unit, hex);
            score += scoreForRangedCombatDice(game, unit, hex);
            score += attackProximityScoreForHex(game, hex, side);
        } else {
            score += scoreForDamageToEnemyUnit(game, unit);
        }
    });

    return score;
}
