import { CloseCombatCommand, MoveCommand, EndPhaseCommand } from "./commands.js";


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

    onClick(hex, game) {
        let events = [];
        if (game.isTerminal())
            return;
        let unit = game.unitAt(hex);
        if (unit && unit !== game.selectedUnit() && unit.side === game.currentSide && !game.isSpent(unit)) {
            game.selectUnit(unit);
        } else if (game.selectedUnit() && this.hexesToHilight(game).includes(hex)) {
            events = this.executeCommandOn(hex, game);
            game.unselectUnit();
        } else {
            game.unselectUnit();
        }
        return events;
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

    executeCommandOn(hex, game) {
        return game.executeCommand(new MoveCommand(hex, game.selectedHex()));
    }

    hexesToHilight(game) {
        return game.selectedUnit().validDestinations(game.selectedHex(), game);
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

    executeCommandOn(hex, game) {
        return game.executeCommand(new CloseCombatCommand(hex, game.selectedHex()));
    }

    hexesToHilight(game) {
        return game.selectedUnit().validCloseCombatTargets(game.selectedHex(), game);
    }

}

