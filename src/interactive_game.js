
import { MoveCommand } from "./model/commands.js";

export class InteractiveGame {
    #game;
    #hilightedHexes = [];
    #selectedUnit = undefined;

    constructor(game) {
        this.#game = game;
    }

    onClick(hex) {
        this.#game.onClick(hex, this);
    }

    selectedUnitCanMoveTo(hex) {
        return this.selectedUnit().validDestinations(this.selectedHex(), this.#game).includes(hex);
    }

    selectedUnitCanCloseCombatTo(hex) {
        return this.selectedUnit().validCloseCombatTargets(this.selectedHex(), this.#game).includes(hex);
    }

    get hilightedHexes() {
        return this.#hilightedHexes;
    }

    hilightHexes(hexes) {
        this.#hilightedHexes = hexes;
    }

    selectedHex() {
        return this.#game.hexOfUnit(this.selectedUnit());
    }

    selectedUnit() {
        return this.#selectedUnit;
    }

    selectUnit(unit) {
        this.#selectedUnit = unit;
    }

    unselectUnit() {
        this.#selectedUnit = undefined;
    }

    get currentSide() {
        return this.#game.currentSide;
    }

    get movementTrails() {
        return this.#game.movementTrails;
    }

    // --- delegate to game ---

    validCommands() {
        return this.#game.validCommands();
    }

    get currentPhaseName() {
        return this.#game.currentPhaseName;
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
        return this.#game.gameStatus;
    }

    executeCommand(command) {
        return this.#game.executeCommand(command);
    }

    moveUnit(hex, fromHex) {
        this.#game.executeCommand(new MoveCommand(hex, fromHex));
    }

    isTerminal() {
        return this.#game.isTerminal();
    }

    subtractOffMap(hexes) {
        return this.#game.subtractOffMap(hexes);
    }

    subtractOccupiedHexes(hexes) {
        return this.#game.subtractOccupiedHexes(hexes);
    }

    endPhase() {
        this.unselectUnit();
        this.hilightHexes([]);
        this.#game.endPhase();
    }
}
