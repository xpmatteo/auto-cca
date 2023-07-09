import { Phase } from "./Phase.js";
import { RangedCombatCommand } from "../commands/ranged_combat_command.js";
import { EndPhaseCommand } from "../commands/end_phase_command.js";

export class FirePhase extends Phase {
    constructor() {
        super("fire");
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
