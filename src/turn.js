
import { MoveCommand, Side } from "./board.js";


export class Turn {
    #spentUnits = [];
    #currentSide = Side.ROMAN;
    #game;

    constructor(game) {
        this.#game = game;
    }

    generateMoves() {
        let moves = [];
        this.#game.foreachUnit((unit, hex) => {
            if (this.#spentUnits.includes(unit)) {
                return;
            }
            if (unit.side !== this.#currentSide) {
                return;
            }
            let hexes = this.#game.subtractOffMap(hex.neighbors());
            hexes = this.#game.subtractOccupiedHexes(hexes);
            hexes.forEach(to => {
                moves.push(new MoveCommand(to, hex));
            });
        });
        if (moves.length === 0) {
            moves.push(new EndOfTurn());
        }
        return moves;
    }

    play(move) {
        move.play(this);        
    }

    get currentSide() {        
        return this.#currentSide;
    }

    get spentUnits() {
        return this.#spentUnits;
    }

    switchSide() {
        this.#currentSide = this.#currentSide === Side.ROMAN ? Side.CARTHAGINIAN : Side.ROMAN;
        this.#spentUnits = [];
        console.log(`Switching side to ${this.#currentSide}`)
    }

    markUnitSpent(unit) {
        this.#spentUnits.push(unit);
    }

    // --- delegate to game ---
    moveUnit(to, from) {
        this.#game.moveUnit(to, from);
    }

    unitAt(hex) {
        return this.#game.unitAt(hex);
    }
}

export class EndOfTurn {
    play(turn) {
        turn.switchSide();
    }

    toString() {
        return "End of turn";
    }
}