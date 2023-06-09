
import { Side } from "./side.js";
import { CloseCombatCommand, MoveCommand } from "./commands.js";
import { EndPhaseCommand } from "./EndPhaseCommand.js";

export class Phase {
    #name;
    constructor(name) {
        this.#name = name;
    }
    toString() {
        return this.#name;
    }
    validCommands(turn, board) {
        let commands = [];
        board.foreachUnit((unit, hex) => {
            if (turn.spentUnits.includes(unit)) {
                return;
            }
            if (unit.side !== turn.currentSide) {
                return;
            }
            unit.validCloseCombatTargets(hex, board).forEach(to => {
                commands.push(new CloseCombatCommand(to, hex));
            });
        });
        commands.push(new EndPhaseCommand());
        return commands;
    }
}

class MovementPhase extends Phase {
    constructor() {
        super("movement");
    }

    validCommands(turn, board) {
        let commands = [];
        board.foreachUnit((unit, hex) => {
            if (turn.spentUnits.includes(unit)) {
                return;
            }
            if (unit.side !== turn.currentSide) {
                return;
            }
            unit.validDestinations(hex, board).forEach(to => {
                commands.push(new MoveCommand(to, hex));
            });
        });
        commands.push(new EndPhaseCommand());
        return commands;
    }
}

class BattlePhase extends Phase {
    constructor() {
        super("battle");
    }
}

const PHASES = [new MovementPhase(), new BattlePhase()];

export class Turn {
    #spentUnits = [];
    #movementTrails = [];
    #currentSide;
    #phases = PHASES.slice();
    #board;

    constructor(board, currentSide = Side.ROMAN) {
        this.#board = board;
        this.#currentSide = currentSide;
    }

    get currentPhase() {
        return this.#phases[0]
    }

    validCommands() {
        return this.currentPhase.validCommands(this, this.#board);
    }

    play(command) {
        command.play(this);        
    }

    get currentSide() {        
        return this.#currentSide;
    }

    get currentPhaseName() {
        return `${this.#currentSide.name} ${this.currentPhase}`;
    }

    get spentUnits() {
        return this.#spentUnits;
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

    markUnitSpent(unit) {
        this.#spentUnits.push(unit);
    }

    // --- delegate to game ---
    moveUnit(to, from) {
        this.#board.moveUnit(to, from);
    }

    unitAt(hex) {
        return this.#board.unitAt(hex);
    }

    get movementTrails() {
        return this.#movementTrails;
    }

    addMovementTrail(hexTo, hexFrom) {
        this.#movementTrails.push(new MovementTrail(hexTo, hexFrom));
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