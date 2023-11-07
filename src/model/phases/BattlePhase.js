import { AskOpponentIfTheyIntendToEvadeCommand } from "../commands/AskOpponentIfTheyIntendToEvadeCommand.js";
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
        game.foreachUnit((attackingUnit, attackingHex) => {
            if (!game.isOrdered(attackingUnit)) {
                return;
            }
            if (game.spentUnits.includes(attackingUnit)) {
                return;
            }
            attackingUnit.validCloseCombatTargets(attackingHex, game).forEach(defendingHex => {
                const defendingUnit = game.unitAt(defendingHex);
                // if (defendingUnit.canEvade(attackingUnit) && game.evasionPaths(defendingHex).length > 0) {
                //     commands.push(new AskOpponentIfTheyIntendToEvadeCommand(defendingHex, attackingHex));
                // } else {
                    commands.push(new CloseCombatCommand(defendingHex, attackingHex));
                // }
            });
            attackingUnit.validRangedCombatTargets(attackingHex, game).forEach(to => {
                commands.push(new RangedCombatCommand(to, attackingHex));
            });
        });
        if (commands.length === 0) {
            commands.push(new EndPhaseCommand());
        }
        return commands;
    }

    hilightedHexes(game) {
        return this.hilightedHexesForDirectionalCommands(game);
    }
}
