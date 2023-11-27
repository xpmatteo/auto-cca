import { Phase } from "./Phase.js";
import { makeRangedCombatCommand } from "../commands/ranged_combat_command.js";
import { endPhaseCommand } from "../commands/EndPhaseCommand.js";

export class FirePhase extends Phase {
    /**
     * @param {string} name
     */
    constructor(name = "fire") {
        super(name);
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
            unit.validRangedCombatTargets(hex, game).forEach(to => {
                commands.push(makeRangedCombatCommand(to, hex));
            });
        });
        commands.push(endPhaseCommand());
        return commands;
    }

    hilightedHexes(game) {
        return this.hilightedHexesForDirectionalCommands(game);
    }
}
