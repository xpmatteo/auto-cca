
import { MoveCommand } from "./game.js";

export class Turn {
    #spentUnits = [];
    #game;

    constructor(game) {
        this.#game = game;
    }

    generateMoves() {
        let moves = [];
        this.#game.foreachUnitOfCurrentSide((unit, hex) => {
            if (this.#spentUnits.includes(unit)) {
                return;
            }
            let hexes = this.#game.subtractOffMap(hex.neighbors());
            hexes = this.#game.subtractOccupiedHexes(hexes);
            hexes.forEach(to => {
                moves.push(new MoveCommand(to, hex));
            });
        });
        return moves;
    }

    play(move) {
        this.#game.play(move);
        this.#spentUnits.push(this.#game.unitAt(move.to));
    }
}