import { Phase } from "./Phase.js";
import {EndPhaseCommand} from "../commands/end_phase_command.js";
import {CloseCombatCommand} from "../commands/close_combat_command.js";
import { RangedCombatCommand } from "../commands/ranged_combat_command.js";


export class BattlePhase extends Phase {
    constructor() {
        super("battle");
    }

    validCommands(game) {
        let commands = [];
        game.foreachUnit((unit, hex) => {
            if (!game.isOrdered(unit)) {
                return;
            }
            if (game.spentUnits.includes(unit)) {
                return;
            }
            unit.validCloseCombatTargets(hex, game).forEach(to => {
                commands.push(new CloseCombatCommand(to, hex));
            });
            unit.validRangedCombatTargets(hex, game).forEach(to => {
                commands.push(new RangedCombatCommand(to, hex));
            });
        });
        commands.push(new EndPhaseCommand());
        return commands;
    }

    hilightedHexes(game) {
        return this.hilightedHexesForDirectionalCommands(game);
    }
}
