
import { MoveCommand } from "./model/commands.js";

export class InteractiveGame {
    #game;
    #selectedUnit = undefined;

    constructor(game) {
        this.#game = game;
    }

    onClick(hex) {
        return this.#game.onClick(hex, this);
    }

    get hilightedHexes() {
        if (this.selectedUnit()) {
            return this.#game.validCommands().
                filter(command => command.fromHex === this.selectedHex()).
                map(command => command.toHex).
                filter(hex => hex !== undefined);            
        }
        return this.#game.validCommands().
            map(command => command.fromHex).
            filter(hex => hex !== undefined);        
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

    closestUnitHex(hex, side) {
        return this.#game.closestUnitHex(hex, side);
    }

    opposingSide(side) {
        return this.#game.opposingSide(side);
    }

    get pointsToWin() {
        return this.#game.pointsToWin;
    }

    killedUnitsOfSide(side) {
        return this.#game.killedUnitsOfSide(side);
    }

    get deadUnitsNorth() {
        return this.#game.deadUnitsNorth;
    }

    get deadUnitsSouth() {
        return this.#game.deadUnitsSouth;
    }

    markUnitSpent(unit) {
        this.#game.markUnitSpent(unit);
    }

    isSpent(unit) {
        return this.#game.isSpent(unit);
    }

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
        this.#game.endPhase();
    }
}
