
export class Game {

    #units = [];

    addUnit(unit) {
        this.#units.push(unit);
    }

    click(hex) {
        this.units[0].isSelected = true;
    }

    get units() {
        return this.#units;
    }
}

export class Unit {
}

export class RomanHeavyInfantry extends Unit {

}