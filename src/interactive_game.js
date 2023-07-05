import { MoveCommand } from "./model/commands/moveCommand.js";

/*
    Decorator for Game that adds interactive features.
*/
export class InteractiveGame {
    #game;
    #selectedUnit = undefined;
    #decorations = [];

    constructor(game) {
        this.#game = game;
    }

    onClick(hex, pixel) {
        if (this.#game.isTerminal())
            return [];
        return this.#game.currentPhase.onClick(hex, this, pixel);
    }

    get hilightedHexes() {
        // We don't want Game to know about highlighting, so we delegate directly to the current phase.
        return this.#game.currentPhase.hilightedHexes(this);
    }

    selectedHex() {
        return this.#game.hexOfUnit(this.selectedUnit());
    }

    selectedUnit() {
        return this.#selectedUnit || this.implicitSelectedUnit();
    }

    implicitSelectedUnit() {
        if (this.currentPhaseName && this.currentPhaseName.includes('retreat')) {
            return this.#game.unitAt(this.validCommands()[0].fromHex);
        }
        return undefined;
    }

    selectUnit(unit) {
        this.#selectedUnit = unit;
    }

    get currentSide() {
        return this.#game.currentSide;
    }

    get movementTrails() {
        return this.#game.movementTrails;
    }

    // --- delegate to game ---

    unitStrength(unit) {
        return this.#game.unitStrength(unit);
    }

    unshiftPhase(phase) {
        this.#game.unshiftPhase(phase);
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

    placeUnit(hex, unit) {
        this.#game.placeUnit(hex, unit);
    }

    get gameStatus() {
        return this.#game.gameStatus;
    }

    executeCommand(command) {
        const events = this.#game.executeCommand(command);
        this.visualizeEvents(events);
        return events;
    }

    visualizeEvents(events) {
        events.forEach(event => {
            event.addDecorations(this.#decorations);
        });
        return events;
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
        console.log('END PHASE');
        this.deselectUnit();
        return this.#game.endPhase();
    }

    deselectUnit() {
        this.#selectedUnit = undefined;
    }

    clone() {
        return new InteractiveGame(this.#game.clone());
    }

    makeKey() {
        return this.#game.makeKey();
    }

    score(side) {
        return this.#game.score(side);
    }

    get currentSideRaw() {
        return this.#game.currentSideRaw;
    }

    isOrdered(unit) {
        return this.#game.isOrdered(unit);
    }

    orderUnit(hex) {
        this.#game.orderUnit(hex);
    }

    unorderUnit(hex) {
        this.#game.unorderUnit(hex);
    }

    get numberOfOrderedUnits() {
        return this.#game.numberOfOrderedUnits;
    }

    get sideSouth() {
        return this.#game.scenario.sideSouth;
    }

    get handSouth() {
        return this.#game.handSouth;
    }

    commandSize(side) {
        return this.#game.commandSize(side);
    }

    hand(side) {
        return this.#game.hand(side);
    }

    playCard(card) {
        return this.#game.playCard(card);
    }

    get currentPhase() {
        return this.#game.currentPhase;
    }

    get currentCard() {
        return this.#game.currentCard;
    }

    undoPlayCard() {
        return this.#game.undoPlayCard();
    }

    get decorations() {
        return this.#decorations;
    }

    hexOfUnit(unit) {
        return this.#game.hexOfUnit(unit);
    }
}
