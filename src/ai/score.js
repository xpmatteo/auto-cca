const SCORE_FOR_SUPPORTED_UNIT = 1;
const SCORE_FOR_EACH_DIE = 1;
const SCORE_FOR_POINT_OF_DAMAGE = 10;

const scoreForRow3 = 100;

function decideDiceCountForRanged(hex, game) {
    return game.unitHasMoved(hex) ? 1 : 2;
}

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

export function score(game, side) {
    let score = 0;
    game.foreachUnit((unit, hex) => {
        if (unit.side === side) {
            if (game.isSupported(hex)) {
                score += SCORE_FOR_SUPPORTED_UNIT;
            }
            unit.validCloseCombatTargets(hex, game).forEach(to => {
                score += unit.diceCount * SCORE_FOR_EACH_DIE;
            });
            unit.validRangedCombatTargets(hex, game).forEach(to => {
                score += decideDiceCountForRanged(hex, game) * SCORE_FOR_EACH_DIE;
            });
            score += scoreForAdvancingToRow(hex.r);
        } else {
            const damage = unit.initialStrength - game.unitStrength(unit);
            score += damage * SCORE_FOR_POINT_OF_DAMAGE;
        }
    });

    return score;
}
