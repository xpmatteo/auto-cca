import { Board } from "./board.js";
import GameStatus from "./game_status.js";
import { Dice } from "./dice.js";
import { Graveyard } from "./graveyard.js";
import { OrderHeavyTroopsCard, OrderLightTroopsCard, OrderMediumTroopsCard } from "./cards.js";
import { PlayCardPhase } from "./phases/play_card_phase.js";

export default function makeGame(scenario, dice = new Dice()) {
    let game = new Game(scenario, dice);
    game.initialize();

    return game;
}

// const PHASES = [new OrderUnitsPhase(3, RESULT_HEAVY), new MovementPhase(), new BattlePhase()];
// const PHASES = [new MovementPhase(), new BattlePhase()];
const PHASES = [new PlayCardPhase()];

class Game {
    board = new Board();
    phases = PHASES.slice();
    currentSideRaw;
    spentUnits = [];
    movementTrails = [];
    unitStrengths = new Map();
    graveyard = new Graveyard();
    orderedUnits = [];
    handNorth = [new OrderHeavyTroopsCard(), new OrderMediumTroopsCard(), new OrderLightTroopsCard()];
    handSouth = [new OrderHeavyTroopsCard(), new OrderMediumTroopsCard(), new OrderLightTroopsCard()];
    turnCount = 0;

    constructor(scenario, dice) {
        this.scenario = scenario;
        this.dice = dice;
    }

    initialize() {
        this.currentSideRaw = this.scenario.firstSide;
        this.scenario.placeUnitsOn(this);
    }

    get currentPhase() {
        return this.phases[0]
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
        if (this.phases.length === 1) {
            this.switchSide();
        } else {
            this.phases.shift();
            this.spentUnits = [];
        }
    }

    switchSide() {
        this.phases = PHASES.slice();
        this.currentSideRaw = this.scenario.opposingSide(this.currentSideRaw);
        this.spentUnits = [];
        this.movementTrails = [];
        this.orderedUnits = [];
        this.turnCount++;
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
        if (side === this.scenario.sideNorth) {
            result = hex.northernNeighbors;            
        } else {
            result = hex.southernNeighbors;
        }
        return this.subtractOffMap(this.subtractOccupiedHexes(result));
    }

    clone() {
        const game = new Game(this.scenario, this.dice);
        game.board = this.board.clone();
        game.phases = this.phases.slice();
        game.currentSideRaw = this.currentSideRaw;
        game.spentUnits = this.spentUnits.slice();
        game.movementTrails = this.movementTrails.slice();
        game.unitStrengths = new Map(this.unitStrengths);
        game.graveyard = this.graveyard.clone();
        game.orderedUnits = this.orderedUnits.slice();
        return game;
    }

    moveUnit(hexTo, hexFrom) {
        this.board.moveUnit(hexTo, hexFrom);
    }

    get currentSide() {
        return this.currentPhase.temporarySide || this.currentSideRaw;
    }

    get currentPhaseName() {
        return `${this.currentSide.name} ${this.currentPhase}`;
    }

    isSpent(unit) {
        return this.spentUnits.includes(unit);
    }

    markUnitSpent(unit) {
        this.spentUnits.push(unit);
    }
    
    unshiftPhase(phase) {
        this.phases.unshift(phase);
    }

    shiftPhase() {
        this.phases.shift();
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
        this.unitStrengths.set(unit, unit.initialStrength);
    }

    unitStrength(unitOrHex) {
        let unit = this.__toUnit(unitOrHex);
        if (!this.unitStrengths.has(unit)) {
            throw new Error(`No unit ${unit} in game`);
        }
        return this.unitStrengths.get(unit);
    }

    takeDamage(unitOrHex, diceRoll, includeFlags = false, includeSwords = true) {
        let unit = this.__toUnit(unitOrHex);
        let damage = unit.takeDamage(diceRoll, includeFlags, includeSwords);
        this.unitStrengths.set(unit, this.unitStrengths.get(unit) - damage);
        if (this.isDead(unit)) {
            this.graveyard.bury(unit);
            this.board.removeUnit(this.hexOfUnit(unit));
        }
        return damage;
    }

    score(side) {
        const SCORE_PER_POINT = 10;
        const SCORE_PER_VICTORY = (this.scenario.pointsToWin + 1) * SCORE_PER_POINT;
        if (this.isTerminal()) {
            if (side === this.gameStatus.side) {
                return SCORE_PER_VICTORY;
            }
            if (side !== this.gameStatus.side) {
                return -SCORE_PER_VICTORY;
            }
            throw new Error(`Invalid side ${side}`);
        }
        let northPoints = this.graveyard.unitsOf(this.scenario.sideSouth).length * SCORE_PER_POINT +
            this.inflictedDamage(this.scenario.sideSouth);
        let southPoints = this.graveyard.unitsOf(this.scenario.sideNorth).length * SCORE_PER_POINT +
            this.inflictedDamage(this.scenario.sideNorth);
        let score = (northPoints - southPoints) / SCORE_PER_VICTORY;
        if (side === this.scenario.sideNorth) {
            return score;
        }
        if (side === this.scenario.sideSouth) {
            return -score;
        }
        throw new Error(`Invalid side ${side}`);
    }

    isDead(unitOrHex) {
        let unit = this.__toUnit(unitOrHex);
        return this.unitStrength(unit) <= 0;
    }

    get spentUnits() {
        return this.spentUnits;
    }

    get movementTrails() {
        return this.movementTrails;
    }

    addMovementTrail(hexTo, hexFrom) {
        this.movementTrails.push(new MovementTrail(hexTo, hexFrom));
    }

    __toUnit(unitOrHex) {
        let unit = unitOrHex;
        if (unitOrHex.constructor.name === 'Hex') {
            let hex = unitOrHex;
            unit = this.unitAt(hex);
            if (!unit)
                throw new Error(`No unit at ${hex}`);
        }
        return unit;
    }

    // Return the total number of strength points removed from the units of the given side.
    // It only counts the units on the board; units in graveyard are not counted
    inflictedDamage(side) {
        return this.board.unitsOfSide(side).reduce((acc, unit) => acc + this.inflictedDamageOnUnit(unit), 0);
    }

    inflictedDamageOnUnit(unit) {
        return unit.initialStrength - this.unitStrength(unit);
    }

    // Return a string that can be used to compare two states for "equivalence"
    // when evaluating chance nodes
    makeKey() {
        const result = [
            Array.from(this.unitStrengths.values()),
            this.graveyard.units,
        ];
        return result.toString();
    }

    unitHasMoved(hex) {
        return this.movementTrails.some(trail => trail.to === hex);
    }

    isSupported(hex) {
        const unit = this.unitAt(hex);
        if (!unit) {
            throw new Error(`No unit at ${hex}`);
        }
        let supportingUnits = 0;
        let hexes = this.subtractOffMap(hex.neighbors());
        hexes.forEach(h => {
            let unit = this.unitAt(h);
            if (unit && unit.side === this.currentSide) {
                supportingUnits++;
            }
        });
        return supportingUnits >= 2;
    }

    isOrdered(unit) {
        return this.orderedUnits.includes(unit);
    }

    orderUnit(hex) {
        let unit = this.unitAt(hex);
        if (!unit) {
            throw new Error(`No unit at ${this.hex}`);
        }
        if (this.isOrdered(unit)) {
            throw new Error("Unit already ordered");
        }
        this.orderedUnits.push(unit);
    }

    unorderUnit(hex) {
        let unit = this.unitAt(hex);
        if (!unit) {
            throw new Error(`No unit at ${this.hex}`);
        }
        if (!this.isOrdered(unit)) {
            throw new Error("Unit is not ordered");
        }
        this.orderedUnits = this.orderedUnits.filter(u => u !== unit);
    }

    get numberOfOrderedUnits() {
        return this.orderedUnits.length;
    }

    commandSize(side) {
        if (!side) {
            side = this.currentSide;
        }
        if (side === this.scenario.sideNorth) {
            return this.scenario.commandNorth;
        } else {
            return this.scenario.commandSouth;
        }
    }

    hand(side) {
        if (!side) {
            side = this.currentSide;
        }
        if (side === this.scenario.sideNorth) {
            return this.handNorth;
        } else {
            return this.handSouth;
        }
    }
}

export class MovementTrail {
    constructor(to, from) {
        this.from = from;
        this.to = to;
    }

    toString() {
        return `MovementTrail(${this.from}, ${this.to})`;
    }
}