const SCORE_FOR_SUPPORTED_UNIT = 1;
const SCORE_FOR_EACH_DIE = 1;
const SCORE_FOR_POINT_OF_DAMAGE = 10;

const scoreForRow3 = 100;

export function scoreForAdvancingToRow(row) {
    const quantum = 1;
    switch (row) {
        case 0:            return -quantum;
        case 1:            return 0;
        case 2:            return quantum;
        case 3:            return 2*quantum;
        case 4:            return 3*quantum;
        case 5:            return 4*quantum;
    }
    return 0;
}

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
            score += scoreForAdvancingToRow(hex.r);
        } else {
            score += scoreForDamageToEnemyUnit(game, unit);
        }
    });

    return score;
}
