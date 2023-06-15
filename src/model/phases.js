import { CloseCombatCommand, MoveCommand, RetreatCommand, EndPhaseCommand } from "./commands.js";


class Phase {
    #name;
    constructor(name) {
        this.#name = name;
        if (new.target === Phase) {
            throw new TypeError("Cannot construct Abstract instances directly");
        }
    }
    
    toString() {
        return this.#name;
    }

    validCommands(turn, board) {
        return [];
    }
}

export class RetreatPhase extends Phase {
    constructor(temporarySide, fromHex, toHexes) {
        super("retreat");
        this.fromHex = fromHex;
        this.toHexes = toHexes;
        this.temporarySide = temporarySide;
    }

    validCommands(turn, board) {
        return this.toHexes.map(toHex => new RetreatCommand(toHex, this.fromHex));
    }
}

export class MovementPhase extends Phase {
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

export class BattlePhase extends Phase {
    constructor() {
        super("battle");
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

