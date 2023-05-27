
export class Game {

    #units = {};
    #hexes = {};

    addUnit(hex, unit) {
        this.#hexes[hex.toString()] = hex;
        this.#units[hex.toString()] = unit;
    }

    click(hex) {
        this.unitAt(hex).toggleSelected();
    }

    foreachUnit(f) {
        for (let hex in this.#units) {
            f(this.#units[hex], this.#hexes[hex]);
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
}

export class RomanHeavyInfantry extends Unit {

    get imageName() {
        return 'rom_inf_hv.png';
    }

}