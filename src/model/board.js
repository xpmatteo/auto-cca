import { hexOf } from '../lib/hexlib.js';


function makeMap() {
    function even(n) {
        return n % 2 === 0;
    }
    
    let map = [];
    for (let r = 0; r <= 8; r++) {
        let col_start = -Math.trunc(r / 2);
        let num_cols = even(r) ? 13 : 12;
        for (let q = col_start; q < col_start + num_cols; q++) {
            let hex = hexOf(q, r);
            map.push(hex);
        }
    }
    return map;
}
const MAP = makeMap();

function getByValue(map, searchValue) {
    for (let [key, value] of map.entries()) {
        if (value === searchValue)
            return key;
    }
}

export class Board {
    #units = new Map();

    addUnit(hex, unit) {
        if (this.unitIsPresent(unit)) {
            throw new Error(`Unit added twice`);
        }
        if (this.#units.has(hex)) {
            throw new Error(`Unit already exists at ${hex}`);
        }
        if (!MAP.includes(hex)) {
            throw new Error(`Hex ${hex} outside of map`);
        }
        this.#units.set(hex, unit);
    }

    moveUnit(to, from) {
        if (!this.#units.has(from)) {
            throw new Error(`No unit at ${from}`);
        }
        if (this.#units.has(to)) {
            throw new Error(`Unit already exists at ${to}`);
        }
        this.#units.set(to, this.#units.get(from));
        this.#units.delete(from);
    }

    subtractOffMap(hexes) {
        return hexes.filter(hex => MAP.includes(hex));
    }

    subtractOccupiedHexes(hexes) {
        return hexes.filter(hex => !this.#units.has(hex));
    }

    foreachUnit(f) {
        this.#units.forEach(f);
    }

    foreachHex(f) {
        MAP.forEach(f);
    }

    unitAt(hex) {
        return this.#units.get(hex);
    }

    hexOfUnit(unit) {
        return getByValue(this.#units, unit);
    }

    unitIsPresent(unit) {
        return Array.from(this.#units.values()).includes(unit);
    }

    play(move) {
        move.execute(this);
    }
}

