import { Hex } from "../lib/hexlib.js";
import { mapToString, stringify } from "../lib/to_string.js";
import { Board } from "./board.js";
import { Order3LeftCard, OrderHeavyTroopsCard, OrderLightTroopsCard, OrderMediumTroopsCard } from "./cards.js";
import { Dice, DiceResult } from "./dice.js";
import { SideSwitchedTo } from "./events.js";
import GameStatus from "./game_status.js";
import { Graveyard } from "./graveyard.js";
import { PlayCardPhase } from "./phases/play_card_phase.js";
import { Unit } from "./units.js";

/**
 * @param {Scenario} scenario
 * @param {{roll(number):DiceResult[]}} dice
 * @returns {Game}
 */
export default function makeGame(scenario, dice = new Dice()) {
    let game = new Game(scenario, dice);
    game.initialize();
    return game;
}

const DEFAULT_PHASES = [new PlayCardPhase()];
const DEFAULT_HAND = [new Order3LeftCard(), new OrderHeavyTroopsCard(), new OrderMediumTroopsCard(), new OrderLightTroopsCard()];

export class Game {
    board = new Board();
    phases = DEFAULT_PHASES.slice();
    currentSideRaw;
    spentUnits = [];
    movementTrails = [];
    unitStrengths = new Map();
    graveyard = new Graveyard();
    orderedUnits = [];
    handNorth = DEFAULT_HAND.slice();
    handSouth = DEFAULT_HAND.slice();
    currentCard = null;
    turnCount = 0;

    /**
     * @param {Scenario} scenario
     * @param {{roll(number):DiceResult[]}} dice
     */
    constructor(scenario, dice) {
        this.scenario = scenario;
        this.dice = dice;
    }

    initialize() {
        this.currentSideRaw = this.scenario.firstSide;
        this.scenario.placeUnitsOn(this);
    }

    toString() {
        return stringify([
            this.board,
            this.phases,
            this.currentSideRaw,
            this.spentUnits,
            mapToString(this.unitStrengths),
            this.graveyard,
            this.orderedUnits,
            this.handNorth,
            this.handSouth,
        ])
    }

    get sideNorth() {
        return this.scenario.sideNorth;
    }

    describeCurrentPhase() {
        if (this.isTerminal()) {
            return `Game over. ${this.gameStatus}`;
        } else {
            return this.currentPhaseName;
        }
    }

    /**
     * @returns {Game}
     */
    toGame() {
        return this;
    }

    /** @returns {Phase} */
    get currentPhase() {
        return this.phases[0]
    }

    /** @returns {Command[]} */
    validCommands() {
        if (this.isTerminal()) return [];
        return this.currentPhase.validCommands(this);
    }

    /**
     * @param {Command} command
     * @returns {GameEvent[]}
     */
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
            return [new SideSwitchedTo(this.currentSide)];
        } else {
            this.phases.shift();
            this.spentUnits = [];
            return [];
        }
    }

    switchSide() {
        this.phases = DEFAULT_PHASES.slice();
        this.currentSideRaw = this.scenario.opposingSide(this.currentSideRaw);
        this.spentUnits = [];
        this.movementTrails = [];
        this.orderedUnits = [];
        this.currentCard = null;
        this.drawCard();
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

    /*
        Return the paths that a unit can retreat along, given a maximum distance.
        The paths are returned as a map from distance to list of hexes that can be retreated to.
        If there is no retreat path, the set is empty
        Examples
        --------
        If the unit is at 4,4 and retreats north and can retreat 1 hex, the result is:
        { 1: [hexOf(4,3), hexOf(5,3)] }
        If it can retreat 2 hexes, the result is:
        { 1: [hexOf(4,3), hexOf(5,3)], 2: [hexOf(4,2), hexOf(5,2), hexOf(6,2)] }
     */
    retreatPaths(hex, maxDistance, side) {
        let neighborFunction;
        if (side === this.scenario.sideNorth) {
            neighborFunction = hex => hex.northernNeighbors;
        } else if (side === this.scenario.sideSouth) {
            neighborFunction = hex => hex.southernNeighbors;
        } else {
            throw new Error(`Invalid side ${side}`);
        }

        let seed = [hex];
        let result = {"0": [hex]};
        let distance = 0;
        for (let i = 0; i < maxDistance; i++) {
            seed = this.subtractOccupiedHexes(this.subtractOffMap(Array.from(new Set(seed.flatMap(neighborFunction)))));
            result[i+1] = seed;
            if (seed.length > 0) {
                distance++;
            }
        }
        result['maxDistance'] = distance;
        return result;
    }

    evasionPaths(hex) {
        const retreatPaths = this.retreatPaths(hex, 2, this.unitAt(hex).side);
        if (retreatPaths[2].length > 0) {
            return retreatPaths[2];
        }
        return retreatPaths[1];
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
        game.currentCard = this.currentCard;
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

    /**
     * @param {number} diceCount
     * @returns {DiceResult[]}
     */
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

    foreachUnitOfSide(side, f) {
        return this.board.foreachUnit( (unit, hex) => {if (unit.side === side) f(unit, hex)});
    }

    /**
     * @param {Hex} hex
     * @returns {Unit|undefined}
     */
    unitAt(hex) {
        return this.board.unitAt(hex);
    }

    /**
     * @param {Unit} unit
     * @returns {Hex|undefined}
     */
    hexOfUnit(unit) {
        return this.board.hexOfUnit(unit);
    }

    subtractOffMap(hexes) {
        return this.board.subtractOffMap(hexes);
    }

    subtractOccupiedHexes(hexes) {
        return this.board.subtractOccupiedHexes(hexes);
    }

    subtractEnemyOccupiedHexes(hexes, mySide) {
        return this.board.subtractEnemyOccupiedHexes(hexes, mySide);
    }

    placeUnit(hex, unit) {
        this.board.placeUnit(hex, unit);
        this.unitStrengths.set(unit, unit.initialStrength);
    }

    unitStrength(unit) {
        if (!unit.movement) {
            throw new Error(`Not an unit ${unit}`);
        }
        if (!this.unitStrengths.has(unit)) {
            throw new Error(`No unit ${unit} in game`);
        }
        return this.unitStrengths.get(unit);
    }

    damageUnit(unit, damage) {
        this.unitStrengths.set(unit, this.unitStrengths.get(unit) - damage);
        if (this.isUnitDead(unit)) {
            this.graveyard.bury(unit);
            this.board.removeUnit(this.hexOfUnit(unit));
        }
        return damage;
    }

    isUnitDead(unit) {
        return this.unitStrength(unit) <= 0;
    }

    addMovementTrail(hexTo, hexFrom) {
        this.movementTrails.push(new MovementTrail(hexTo, hexFrom));
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

    unitHasMoved(currentHex) {
        return this.movementTrails.some(trail => trail.to === currentHex);
    }

    unitDistanceMoved(currentHex) {
        const trail = this.movementTrails.find(trail => trail.to === currentHex);
        return trail ? trail.distance : 0;
    }

    isSupported(hex) {
        const unit = this.unitAt(hex);
        if (!unit) {
            throw new Error(`No unit at ${hex}`);
        }
        let supportingUnits = 0;
        let hexes = this.neighbors(hex);
        hexes.forEach(h => {
            let neighboringUnit = this.unitAt(h);
            if (neighboringUnit && neighboringUnit.side === unit.side) {
                supportingUnits++;
            }
        });
        return supportingUnits >= 2;
    }

    /**
     * @param {Unit} unit
     * @returns {boolean}
     */
    isOrdered(unit) {
        return this.orderedUnits.includes(unit);
    }

    /**
     * @param {Hex} hex
     */
    orderUnit(hex) {
        let unit = this.unitAt(hex);
        if (!unit) {
            throw new Error(`No unit at ${hex}`);
        }
        if (this.isOrdered(unit)) {
            throw new Error("Unit already ordered");
        }
        this.orderedUnits.push(unit);
    }

    /**
     * @param {Hex} hex
     */
    unorderUnit(hex) {
        let unit = this.unitAt(hex);
        if (!unit) {
            throw new Error(`No unit at ${hex}`);
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

    playCard(card) {
        this.__removeCardFromHand(card);
        this.currentCard = card;
        this.phases = [card.orderPhase(this)].concat(card.phases());
        this.phases[0].executePreliminaryOperations(this);
        return [];
    }

    undoPlayCard() {
        this.__addCardToHand(this.currentCard);
        this.currentCard = null;
        this.phases = DEFAULT_PHASES.slice();
        this.orderedUnits = [];
        return [];
    }

    __addCardToHand(card, side) {
        if (!side) {
            side = this.currentSide;
        }
        if (side === this.scenario.sideNorth) {
            this.handNorth.push(card);
        } else {
            this.handSouth.push(card);
        }
    }

    __removeCardFromHand(card, side) {
        if (!side) {
            side = this.currentSide;
        }
        if (side === this.scenario.sideNorth) {
            this.handNorth = this.handNorth.filter(c => c !== card);
        } else {
            this.handSouth = this.handSouth.filter(c => c !== card);
        }
    }

    drawCard(side) {
        if (!side) {
            side = this.currentSide;
        }
        if (side === this.scenario.sideNorth) {
            this.handNorth = DEFAULT_HAND.slice();
        } else {
            this.handSouth = DEFAULT_HAND.slice();
        }
    }

    neighbors(hex) {
        return this.board.neighbors(hex);
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

    get distance() {
        return this.from.distance(this.to);
    }
}
