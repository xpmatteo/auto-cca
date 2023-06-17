import { MoveCommand, EndPhaseCommand } from "../commands.js";
import { Phase } from "./Phase.js";


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
