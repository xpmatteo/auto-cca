import { Board } from "./board.js";
import { Turn } from "./turn.js";
import * as GameStatus from "./game_status.js";
import { Dice } from "./dice.js";
import { Graveyard } from "./graveyard.js";
import { Side } from "./side.js";

export default function makeGame(scenario, dice = new Dice()) {
    let game = new Game(scenario, dice);
    game.initialize();

    return game;
}

class Game {
    constructor(scenario, dice, board, turn, graveyard= new Graveyard()) {
        this.scenario = scenario;
        this.dice = dice;
        this.board = board;
        this.turn = turn;
        this.graveyard = graveyard;
    }

    initialize() {
        this.board = new Board();
        this.turn = new Turn(this.board, this.scenario.firstSide);
        this.scenario.placeUnitsOn(this.board);
    }

    validCommands() {
        if (this.isTerminal()) return [];
        return this.turn.validCommands();
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
        this.turn.endPhase();
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
            this.turn.clone(),
            this.graveyard.clone()
        );
    }

    // ---- delegate to turn ----

    moveUnit(hexTo, hexFrom) {
        this.turn.moveUnit(hexTo, hexFrom);
    }

    endPhase() {
        this.turn.endPhase();
    }

    get currentSide() {
        return this.turn.currentSide;
    }

    get currentPhaseName() {
        return this.turn.currentPhaseName;
    }

    isSpent(unit) {
        return this.turn.isSpent(unit);
    }

    markUnitSpent(unit) {
        this.turn.markUnitSpent(unit);
    }
    
    unshiftPhase(phase) {
        this.turn.unshiftPhase(phase);
    }

    shiftPhase() {
        this.turn.shiftPhase();
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
        return this.turn.spentUnits;
    }

    get movementTrails() {
        return this.turn.movementTrails;
    }

    addMovementTrail(hexTo, hexFrom) {
        this.turn.addMovementTrail(hexTo, hexFrom);
    }
}
