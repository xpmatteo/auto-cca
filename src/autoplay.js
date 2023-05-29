
export class Autoplay {
    constructor(game) {
        this.game = game;
    }

    play() {
        let moves = this.game.generateMoves();
        if (moves.length === 0) {
            return false;
        }
        let move = moves[Math.floor(Math.random() * moves.length)];
        this.game.play(move);
        return true;
    }
}