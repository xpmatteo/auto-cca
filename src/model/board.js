import { Hex, hexOf } from '../lib/hexlib.js';
import { mapToString } from "../lib/to_string.js";

/** @type {Set<Hex>} */
const MAP = new Set();

/** @type {Set<Hex>} */
export const MAP_WEST = new Set();

function isWest(r, q) {
    return  r == 0 && q <= 4 ||
            r == 1 && q <= 3 ||
            r == 2 && q <= 3 ||
            r == 3 && q <= 2 ||
            r == 4 && q <= 2 ||
            r == 5 && q <= 1 ||
            r == 6 && q <= 1 ||
            r == 7 && q <= 0 ||
            r == 8 && q <= 0;
}

function makeMap() {
    function even(n) {
        return n % 2 === 0;
    }

    for (let r = 0; r <= 8; r++) {
        let col_start = -Math.trunc(r / 2);
        let num_cols = even(r) ? 13 : 12;
        for (let q = col_start; q < col_start + num_cols; q++) {
            let hex = hexOf(q, r);
            MAP.add(hex);
            if (isWest(r, q)) {
                MAP_WEST.add(hex);
            }
        }
    }
}
if (MAP.size === 0) makeMap();

function getByValue(map, searchValue) {
    for (let [key, value] of map.entries()) {
        if (value === searchValue)
            return key;
    }
}

export class Board {
    #units = new Map();

    placeUnit(hex, unit) {
        if (this.unitIsPresent(unit)) {
            throw new Error(`Unit added twice`);
        }
        if (this.#units.has(hex)) {
            throw new Error(`Unit already exists at ${hex}`);
        }
        if (!MAP.has(hex)) {
            throw new Error(`Hex ${hex} outside of map`);
        }
        this.#units.set(hex, unit);
    }

    moveUnit(to, from) {
        if (!this.#units.has(from)) {
            throw new Error(`No unit at ${from}`);
        }
        if (to === from) {
            // retreat to same hex
            return;
        }
        if (this.#units.has(to)) {
            throw new Error(`Unit already exists at ${to}`);
        }
        this.#units.set(to, this.#units.get(from));
        this.#units.delete(from);
    }

    removeUnit(hex) {
        if (!this.#units.has(hex)) {
            throw new Error(`No unit at ${hex}`);
        }
        this.#units.delete(hex);
    }

    subtractOffMap(hexes) {
        return hexes.filter(hex => MAP.has(hex));
    }

    subtractOccupiedHexes(hexes) {
        return hexes.filter(hex => !this.#units.has(hex));
    }

    subtractEnemyOccupiedHexes(hexes, mySide) {
        return hexes.filter(hex => {
            const otherUnit = this.#units.get(hex);
            return !otherUnit || otherUnit.side === mySide;
        });
    }

    foreachUnit(f) {
        this.#units.forEach(f);
    }

    foreachHex(f) {
        MAP.forEach(f);
    }

    /**
     * @param {Hex} hex
     * @returns {Unit|undefined}
     */
    unitAt(hex) {
        return this.#units.get(hex);
    }

    /**
     * @param {Unit} unit
     * @returns {Hex|undefined}
     */
    hexOfUnit(unit) {
        return getByValue(this.#units, unit);
    }

    unitIsPresent(unit) {
        return Array.from(this.#units.values()).includes(unit);
    }

    play(move) {
        move.execute(this);
    }

    unitsOfSide(side) {
        return Array.from(this.#units.values()).filter(unit => unit.side === side);
    }

    neighbors(hex) {
        return this.subtractOffMap(hex.neighbors());
    }

    clone() {
        let board = new Board();
        this.foreachUnit((unit, hex) => {
            board.placeUnit(hex, unit);
        });
        return board;
    }

    toString() {
        return mapToString(this.#units);
    }
}

