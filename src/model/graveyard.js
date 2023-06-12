"use strict";

export class Graveyard {
    #units = [];

    bury(unit) {
        this.#units.push(unit);
    }

    unitsOf(side) {
        return this.#units.filter(unit => unit.side === side);
    }
}
