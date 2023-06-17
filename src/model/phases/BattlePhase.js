import { CloseCombatCommand, EndPhaseCommand } from "../commands.js";
import { Phase } from "./Phase.js";


export class BattlePhase extends Phase {
    constructor() {
        super("battle");
    }

    validCommands(game, board) {
        let commands = [];
        board.foreachUnit((unit, hex) => {
            if (game.spentUnits.includes(unit)) {
                return;
            }
            if (unit.side !== game.currentSide) {
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
