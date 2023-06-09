
import { MoveCommand } from "./model/commands.js";

export class InteractiveGame {
    #game;
    #hilightedHexes = [];
    #selectedUnit = undefined;

    constructor(game) {
        this.#game = game;
    }

    click(hex) {
        if (this.isTerminal()) 
            return;
        let unit = this.unitAt(hex);
        if (unit && unit !== this.selectedUnit()) {
            this.#selectedUnit = unit;
        } else if (this.selectedUnit() && this.selectedUnitCanMoveTo(hex)) {
            this.#game.executeCommand(new MoveCommand(hex, this.selectedHex()));
            this.#selectedUnit = undefined;
        } else {
            this.#selectedUnit = undefined;
        }
        if (this.selectedUnit()) {
            this.#hilightedHexes = this.selectedUnit().validDestinations(this.selectedHex(), this.#game);
        } else {
            this.#hilightedHexes = [];
        }
    }

    selectedUnitCanMoveTo(hex) {
        return this.selectedUnit().validDestinations(this.selectedHex(), this.#game).includes(hex);
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

    validCommands() {
        return this.#game.validCommands();
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

    get units() {
        return this.#game.units;
    }

    get hexes() {
        return this.#game.hexes;
    }

    placeUnit(hex, unit) {
        this.#game.placeUnit(hex, unit);
    }

    get gameStatus() {
        console.log(`gameStatus: ${this.#game}`);
        return this.#game.gameStatus;
    }

    executeCommand(command) {
        this.#game.executeCommand(command);
    }

    moveUnit(hex, fromHex) {
        this.#game.executeCommand(new MoveCommand(hex, fromHex));
    }

    isTerminal() {
        return this.#game.isTerminal();
    }

    get currentSide() {
        return this.#game.currentSide;
    }

    get movementTrails() {
        return this.#game.movementTrails;
    }
}
