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
        let selectedUnit, selectedHex;
        this.foreachUnit((unit, hex) => {
            if (unit.isSelected) {
                selectedUnit = unit;
                selectedHex = hex;
            }
        });
        if (unit) {
            unit.toggleSelected();
        } else if (selectedUnit && hex.distance(selectedHex) === 1) {
            this.moveUnit(hex, selectedHex);
            this.deselectAll();
        } else {
            this.deselectAll();
        }
    }

    deselectAll() {
        this.foreachUnit((unit, hex) => {
            unit.deselect();
        });
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
}

export class Side {
    static ROMAN = new Side('Roman');
    constructor(name) {
        this.name = name;
    }
}

export class Unit {
    #isSelected = false;

    toggleSelected() {
        this.#isSelected = !this.#isSelected;
    }

    get imageName() {
        return '';
    }

    get allegiance() {
        return Side.ROMAN;
    }

    get isSelected() {
        return this.#isSelected;
    }

    deselect() {
        this.#isSelected = false;
    }
}

export class RomanHeavyInfantry extends Unit {

    get imageName() {
        return 'rom_inf_hv.png';
    }

}