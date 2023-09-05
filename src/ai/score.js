const SCORE_FOR_SUPPORTED_UNIT = 1;
const SCORE_FOR_EACH_DIE = 1;

function decideDiceCountForRanged(hex, game) {
    return game.unitHasMoved(hex) ? 1 : 2;
}

export function score(game, side) {
    let score = 0;
    game.foreachUnitOfSide(side, (unit, hex) => {
        if (game.isSupported(hex)) {
            score += SCORE_FOR_SUPPORTED_UNIT;
        }
        unit.validCloseCombatTargets(hex, game).forEach(to => {
            score += unit.diceCount * SCORE_FOR_EACH_DIE;
        });
        unit.validRangedCombatTargets(hex, game).forEach(to => {
            score += decideDiceCountForRanged(hex, game) * SCORE_FOR_EACH_DIE;
        });
    });

    return score;
}
