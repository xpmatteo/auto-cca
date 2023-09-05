
export function score(game, side) {
    let score = 0;
    game.foreachUnitOfSide(side, (unit, hex) => {
        if (game.isSupported(hex)) {
            score += 1;
        }
    });

    return score;
}
