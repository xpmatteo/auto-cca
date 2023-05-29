import { hexOf } from './hexlib.js';

function even(n) {
    return n % 2 === 0;
}

function enumerateHexes(f) {
    for (let r = 0; r <= 8; r++) {
        let col_start = -Math.trunc(r / 2);
        let num_cols = even(r) ? 13 : 12;
        for (let q = col_start; q < col_start + num_cols; q++) {
            let hex = hexOf(q, r);
            f(hex);
        }
    }
}

function getByValue(map, searchValue) {
    for (let [key, value] of map.entries()) {
        if (value === searchValue)
            return key;
    }
}

export class Game {
    #units = new Map();
    #hexes = [];

    constructor() {
        enumerateHexes(hex => {
            this.#hexes.push(hex);
        });
    }

    addUnit(hex, unit) {
        if (this.unitIsPresent(unit)) {
            throw new Error(`Unit added twice`);
        }
        if (this.#units.has(hex)) {
            throw new Error(`Unit already exists at ${hex}`);
        }
        if (!this.#hexes.includes(hex)) {
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
        return hexes.filter(hex => this.#hexes.includes(hex));
    }

    subtractOccupiedHexes(hexes) {
        return hexes.filter(hex => !this.#units.has(hex));
    }

    foreachUnit(f) {
        this.#units.forEach(f);
    }

    foreachHex(f) {
        this.#hexes.forEach(f);
    }

    unitAt(hex) {
        return this.#units.get(hex);
    }

    hexOfUnit(unit) {
        return getByValue(this.#units, unit);
    }

    subtractOccupiedHexes(hexes) {
        return hexes.filter(hex => !this.#units.has(hex));
    }

    unitIsPresent(unit) {
        return Array.from(this.#units.values()).includes(unit);
    }
}

export class Side {
    static ROMAN = new Side('Roman');
    static CARTHAGINIAN = new Side('Carthaginian');
    constructor(name) {
        this.name = name;
    }
}

export class Unit {
    #imageName;
    #side;

    constructor(imageName, side) {
        this.#imageName = imageName;
        this.#side = side;
    }

    get imageName() {
        return this.#imageName;
    }

    get side() {
        return this.#side;
    }
}


export class RomanHeavyInfantry extends Unit {
    constructor() {
        super('rom_inf_hv.png', Side.ROMAN);
    }
}

export class CarthaginianHeavyInfantry extends Unit {
    constructor() {
        super('car_inf_hv.png', Side.CARTHAGINIAN);
    }
}