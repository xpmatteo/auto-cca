
import { Side } from "./side.js";
import { MoveCommand } from "./commands.js";
import { EndPhaseCommand } from "./EndPhaseCommand.js";

export class Phase {
    #name;
    constructor(name) {
        this.#name = name;
    }
    toString() {
        return this.#name;
    }
}

class MovementPhase extends Phase {
    constructor() {
        super("movement");
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
        let commands = [];
        this.#board.foreachUnit((unit, hex) => {
            if (this.#spentUnits.includes(unit)) {
                return;
            }
            if (unit.side !== this.#currentSide) {
                return;
            }
            unit.validDestinations(hex, this.#board).forEach(to => {
                commands.push(new MoveCommand(to, hex));
            });
        });
        if (commands.length === 0) {
            commands.push(new EndPhaseCommand());
        }
        return commands;
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