import { Side } from "./side.js";

class GameStatus {
    constructor(name, side) {
        this.name = name;
        this.side = side;
    }

    toString() {
        return this.name;
    }
}

export const ONGOING = new GameStatus("ongoing");
export const ROMAN_WIN = new GameStatus("Roman victory", Side.ROMAN);
export const CARTHAGINIAN_WIN = new GameStatus("Carthaginian victory", Side.CARTHAGINIAN);

// This status never occurs in real play; it is only used in quick evaluation of which side is winning,
// in which case it represents "no side is winning"
export const DRAW = new GameStatus("draw");
