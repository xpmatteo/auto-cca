import { CloseCombatWithEvasionCommand } from "../commands/CloseCombatWithEvasionCommand.js";
import { Phase } from "./Phase.js";
import {endPhaseCommand} from "../commands/EndPhaseCommand.js";
import {makeCloseCombatCommand} from "../commands/close_combat_command.js";
import { makeRangedCombatCommand } from "../commands/ranged_combat_command.js";


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
                if (defendingUnit.canEvade(attackingUnit) && game.evasionPaths(defendingHex).length > 0) {
                    commands.push(new CloseCombatWithEvasionCommand(defendingUnit.side, defendingHex, attackingHex));
                } else {
                    commands.push(makeCloseCombatCommand(defendingHex, attackingHex));
                }
            });
            attackingUnit.validRangedCombatTargets(attackingHex, game).forEach(to => {
                commands.push(makeRangedCombatCommand(to, attackingHex));
            });
        });
        if (commands.length === 0) {
            commands.push(endPhaseCommand());
        }
        return commands;
    }

    hilightedHexes(game) {
        return this.hilightedHexesForDirectionalCommands(game);
    }
}
