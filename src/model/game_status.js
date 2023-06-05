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
export const ROMAN_WIN = new GameStatus("roman win", Side.ROMAN);
export const CARTHAGINIAN_WIN = new GameStatus("carthaginian win", Side.CARTHAGINIAN);