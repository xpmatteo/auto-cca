import { Board } from "./board.js";
import * as GameStatus from "./game_status.js";
import { Dice } from "./dice.js";
import { Graveyard } from "./graveyard.js";
import { Side } from "./side.js";
import { MovementPhase, BattlePhase } from "./phases.js";

export default function makeGame(scenario, dice = new Dice()) {
    let game = new Game(scenario, dice);
    game.initialize();

    return game;
}

const PHASES = [new MovementPhase(), new BattlePhase()];

class Game {
    board = new Board();
    #phases = PHASES.slice();
    #currentSide;
    #spentUnits = [];
    #movementTrails = [];
    graveyard = new Graveyard();

    constructor(scenario, dice) {
        this.scenario = scenario;
        this.dice = dice;
    }

    initialize() {
        this.#currentSide = this.scenario.firstSide;
        this.scenario.placeUnitsOn(this.board);
    }

    get currentPhase() {
        return this.#phases[0]
    }

    validCommands() {
        if (this.isTerminal()) return [];
        return this.currentPhase.validCommands(this, this.board);
    }

    executeCommand(command) {
        if (this.isTerminal()) 
            throw new Error("Cannot execute commands: game is over");
        return command.play(this);
    }

    isTerminal() {
        return this.gameStatus !== GameStatus.ONGOING;
    }

    endPhase() {
        if (this.#phases.length === 1) {
            this.switchSide();
        } else {
            this.#phases.shift();
            this.#spentUnits = [];
        }
    }

    switchSide() {
        this.#phases = PHASES.slice();
        this.#currentSide = this.#currentSide === Side.ROMAN ? Side.CARTHAGINIAN : Side.ROMAN;
        this.#spentUnits = [];
        this.#movementTrails = [];
    }

    killUnit(hex) {
        this.graveyard.bury(this.board.unitAt(hex));
        this.board.removeUnit(hex);
    }

    get deadUnitsNorth() {
        return this.graveyard.unitsOf(this.scenario.sideNorth);
    }

    get deadUnitsSouth() {
        return this.graveyard.unitsOf(this.scenario.sideSouth);
    }

    killedUnitsOfSide(side) {
        return this.graveyard.unitsOf(side);
    }

    retreatHexes(hex) {
        const retreatingUnit = this.board.unitAt(hex);
        if (!retreatingUnit) {
            throw new Error(`No unit at ${hex}`);
        }
        const side = retreatingUnit.side;
        let result;
        if (side === Side.CARTHAGINIAN) {
            result = hex.northernNeighbors;            
        } else {
            result = hex.southernNeighbors;
        }
        return this.subtractOffMap(this.subtractOccupiedHexes(result));
    }

    clone() {
        return new Game(
            this.scenario,
            this.dice,
            this.board.clone(),
            this.graveyard.clone()
        );
    }

    moveUnit(hexTo, hexFrom) {
        this.board.moveUnit(hexTo, hexFrom);
    }

    get currentSide() {
        return this.currentPhase.temporarySide || this.#currentSide;
    }

    get currentPhaseName() {
        return `${this.currentSide.name} ${this.currentPhase}`;
    }

    isSpent(unit) {
        return this.#spentUnits.includes(unit);
    }

    markUnitSpent(unit) {
        this.#spentUnits.push(unit);
    }
    
    unshiftPhase(phase) {
        this.#phases.unshift(phase);
    }

    shiftPhase() {
        this.#phases.shift();
    }

    // ---- delegate to dice ----

    roll(diceCount) {
        return this.dice.roll(diceCount);
    }

    // ---- delegate to scenario ----

    get pointsToWin() {
        return this.scenario.pointsToWin;
    }
    
    get gameStatus() {
        return this.scenario.gameStatus(this);
    }

    opposingSide(side) {
        return this.scenario.opposingSide(side);
    }

    // ---- delegate to board ----

    foreachHex(f) {
        return this.board.foreachHex(f);
    }

    foreachUnit(f) {
        return this.board.foreachUnit(f);
    }

    unitAt(hex) {
        return this.board.unitAt(hex);
    }

    hexOfUnit(unit) {
        return this.board.hexOfUnit(unit);
    }

    subtractOffMap(hexes) {
        return this.board.subtractOffMap(hexes);
    }

    subtractOccupiedHexes(hexes) {
        return this.board.subtractOccupiedHexes(hexes);
    }

    placeUnit(hex, unit) {
        this.board.placeUnit(hex, unit);
    }

    get spentUnits() {
        return this.#spentUnits;
    }

    get movementTrails() {
        return this.#movementTrails;
    }

    addMovementTrail(hexTo, hexFrom) {
        this.#movementTrails.push(new MovementTrail(hexTo, hexFrom));
    }
}

class MovementTrail {
    constructor(to, from) {
        this.from = from;
        this.to = to;
    }

    toString() {
        return `MovementTrail(${this.from}, ${this.to})`;
    }
}