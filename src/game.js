import { Hex } from './hexlib.js';

function even(n) {
    return n % 2 === 0;
}

function enumerateHexes(f) {
    for (let r = 0; r <= 8; r++) {
        let col_start = -Math.trunc(r / 2);
        let num_cols = even(r) ? 13 : 12;
        for (let q = col_start; q < col_start + num_cols; q++) {
            let hex = new Hex(q, r);
            f(hex);
        }
    }
}

export class Game {
    #units = {};
    #hexes = {};
    #hilightedHexes = [];
    #selectedUnit = undefined;

    constructor(hexes = {}) {
        enumerateHexes(hex => {
            this.#hexes[hex.toString()] = hex;
        });
    }

    addUnit(hex, unit) {
        if (Object.values(this.#units).includes(unit)) {
            throw new Error(`Unit added twice`);
        }
        if (this.#units[hex.toString()]) {
            throw new Error(`Unit already exists at ${hex.toString()}`);
        }
        if (!this.#hexes[hex.toString()]) {
            throw new Error(`Hex ${hex.toString()} outside of map`);
        }
        this.#units[hex.toString()] = unit;
    }

    moveUnit(to, from) {
        if (!this.#units[from.toString()]) {
            throw new Error(`No unit at ${from.toString()}`);
        }
        if (this.#units[to.toString()]) {
            throw new Error(`Unit already exists at ${to.toString()}`);
        }
        this.#units[to.toString()] = this.#units[from.toString()];
        delete this.#units[from.toString()];
    }

    click(hex) {
        let unit = this.unitAt(hex);
        if (unit && unit !== this.selectedUnit()) {
            this.#selectedUnit = unit;
        } else if (this.selectedUnit() && this.selectedUnitCanMoveTo(hex)) {
            this.moveUnit(hex, this.selectedHex());
            this.#selectedUnit = undefined;
        } else {
            this.#selectedUnit = undefined;
        }
        if (this.selectedUnit()) {
            this.#hilightedHexes = this.eligibleHexesForSelectedUnit();
        } else {
            this.#hilightedHexes = [];
        }
    }

    eligibleHexesForSelectedUnit() {
        return this.subtractOffMap(subtractOccupiedHexes(this.selectedHex().neighbors(), Object.keys(this.#units)));
    }

    subtractOffMap(hexes) {
        return hexes.filter(hex => this.#hexes[hex.toString()]);
    }

    selectedUnitCanMoveTo(hex) {
        return this.eligibleHexesForSelectedUnit().map(h => h.toString()).includes(hex.toString());
    }

    selectedHex() {
        return this.#hexes[Object.keys(this.#units).find(hex => this.#units[hex] === this.#selectedUnit)];
    }

    foreachUnit(f) {
        for (let hex in this.#units) {
            f(this.#units[hex], this.#hexes[hex]);
        }
    }

    foreachHex(f) {
        for (let hex in this.#hexes) {
            f(this.#hexes[hex]);
        }
    }

    unitAt(hex) {
        return this.#units[hex.toString()];
    }

    get hilightedHexes() {
        return this.#hilightedHexes;
    }

    selectedUnit() {
        return this.#selectedUnit;
    }
}

export class InteractiveGame {
    #game;
    constructor(game) {
        this.#game = game;
    }

    addUnit(hex, unit) {
        this.#game.addUnit(hex, unit);
    }

    click(hex) {
        this.#game.click(hex);
    }

    foreachUnit(f) {
        this.#game.foreachUnit(f);
    }

    foreachHex(f) {
        this.#game.foreachHex(f);
    }

    unitAt(hex) {
        return this.#game.unitAt(hex);
    }

    get hilightedHexes() {
        return this.#game.hilightedHexes;
    }

    selectedUnit() {
        return this.#game.selectedUnit();
    }

    selectedHex() {
        return this.#game.selectedHex();
    }

    get units() {
        return this.#game.units;
    }

    get hexes() {
        return this.#game.hexes;
    }
}

function subtractOccupiedHexes(hexes, occupiedHexes) {
    return hexes.filter(hex => !occupiedHexes.includes(hex.toString()));
}

export class Side {
    static ROMAN = new Side('Roman');
    constructor(name) {
        this.name = name;
    }
}

export class Unit {
    get imageName() {
        return '';
    }

    get allegiance() {
        return Side.ROMAN;
    }
}

export class RomanHeavyInfantry extends Unit {

    get imageName() {
        return 'rom_inf_hv.png';
    }

}

export class CarthaginianHeavyInfantry extends Unit {

    get imageName() {
        return 'car_inf_hv.png';
    }

}