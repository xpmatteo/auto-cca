import { Side } from "./side.js";

export default class GameStatus {
    static ONGOING = new GameStatus("ongoing");
    static ROMAN_WIN = new GameStatus("Roman victory", Side.ROMAN);
    static CARTHAGINIAN_WIN = new GameStatus("Carthaginian victory", Side.CARTHAGINIAN);

    // This status never occurs in real play; it is only used in quick evaluation of which side is winning,
    // in which case it represents "no side is winning"
    static DRAW = new GameStatus("draw");

    constructor(name, side) {
        this.name = name;
        this.side = side;
    }

    toString() {
        return this.name;
    }
}

GameStatus.victoryOf = function(side) {
    if (side === Side.ROMAN) {
        return GameStatus.ROMAN_WIN;
    } else if (side === Side.CARTHAGINIAN) {
        return GameStatus.CARTHAGINIAN_WIN;
    } else {
        throw new Error(`Unknown side ${side}`);
    }
}