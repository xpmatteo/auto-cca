
export class Game {

    #units = {};

    addUnit(unit) {
        this.#units.push(unit);
    }

    click(hex) {
        this.units[0].isSelected = !this.units[0].isSelected;
    }

    foreachUnit(f) {

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