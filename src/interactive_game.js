

export class InteractiveGame {
    #game;
    #hilightedHexes = [];
    #selectedUnit = undefined;

    constructor(game) {
        this.#game = game;
    }

    click(hex) {
        let unit = this.unitAt(hex);
        if (unit && unit !== this.selectedUnit()) {
            this.#selectedUnit = unit;
        } else if (this.selectedUnit() && this.selectedUnitCanMoveTo(hex)) {
            this.#game.moveUnit(hex, this.selectedHex());
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
        return this.#game.subtractOffMap(this.#game.subtractOccupiedHexes(this.selectedHex().neighbors()));
    }

    selectedUnitCanMoveTo(hex) {
        return this.eligibleHexesForSelectedUnit().map(h => h.toString()).includes(hex.toString());
    }

    get hilightedHexes() {
        return this.#hilightedHexes;
    }

    selectedHex() {
        return this.#game.hexOfUnit(this.selectedUnit());
    }

    selectedUnit() {
        return this.#selectedUnit;
    }

    // --- delegate to game ---

    foreachUnit(f) {
        this.#game.foreachUnit(f);
    }

    foreachHex(f) {
        this.#game.foreachHex(f);
    }

    unitAt(hex) {
        return this.#game.unitAt(hex);
    }

    get units() {
        return this.#game.units;
    }

    get hexes() {
        return this.#game.hexes;
    }

    placeUnit(hex, unit) {
        this.#game.placeUnit(hex, unit);
    }
}
