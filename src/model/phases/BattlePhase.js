import { Phase } from "./Phase.js";
import {EndPhaseCommand} from "../commands/endPhaseCommand.js";
import {CloseCombatCommand} from "../commands/closeCombatCommand.js";
import { RangedCombatCommand } from "../commands/ranged_combat_command.js";


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
            if (commands.length > 0) {
                return;
            }
            unit.validRangedCombatTargets(hex, game).forEach(to => {
                commands.push(new RangedCombatCommand(to, hex));
            });
        });
        commands.push(new EndPhaseCommand());
        return commands;
    }
}
