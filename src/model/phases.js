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

    onClick(hex, game) {
        if (game.isTerminal())
            return;
        let unit = game.unitAt(hex);
        if (unit && unit !== game.selectedUnit()) {
            game.selectUnit(unit);
        } else if (game.selectedUnit() && game.selectedUnitCanMoveTo(hex)) {
            game.executeCommand(new MoveCommand(hex, game.selectedHex()));
            game.unselectUnit();
        } else {
            game.unselectUnit();
        }
        if (game.selectedUnit()) {
            game.hilightHexes(game.selectedUnit().validDestinations(game.selectedHex(), game));
        } else {
            game.hilightHexes([]);
        }
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

    onClick(hex, game) {
        if (game.isTerminal())
            return;
        let unit = game.unitAt(hex);
        if (unit && unit !== game.selectedUnit() && unit.side === game.currentSide) {
            game.selectUnit(unit);
        } else if (game.selectedUnit() && game.selectedUnitCanCloseCombatTo(hex)) {
            game.executeCommand(new CloseCombatCommand(hex, game.selectedHex()));
            game.unselectUnit();
        } else {
            game.unselectUnit();
        }
        if (game.selectedUnit()) {
            game.hilightHexes(game.selectedUnit().validCloseCombatTargets(game.selectedHex(), game));
        } else {
            game.hilightHexes([]);
        }
    }
}

