"use strict";

export class Graveyard {
    #units = [];

    bury(unit) {
        this.#units.push(unit);
    }

    unitsOf(side) {
        return this.#units.filter(unit => unit.side === side);
    }

    clone() {
        const clone = new Graveyard();
        clone.#units = this.#units.slice();
        return clone;
    }
}
