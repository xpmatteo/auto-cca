import { CloseCombatCommand, EndPhaseCommand } from "../commands/commands.js";
import { Phase } from "./Phase.js";


export class BattlePhase extends Phase {
    constructor() {
        super("battle");
    }

    validCommands(game) {
        let commands = [];
        game.foreachUnit((unit, hex) => {
            if (game.spentUnits.includes(unit)) {
                return;
            }
            if (unit.side !== game.currentSide) {
                return;
            }
            unit.validCloseCombatTargets(hex, game).forEach(to => {
                commands.push(new CloseCombatCommand(to, hex));
            });
        });
        commands.push(new EndPhaseCommand());
        return commands;
    }
}
