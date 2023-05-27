
export class Game {

    #units = {};
    #hexes = {};

    addUnit(hex, unit) {
        this.#hexes[hex.toString()] = hex;
        this.#units[hex.toString()] = unit;
    }

    click(hex) {
        this.units[0].isSelected = !this.units[0].isSelected;
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