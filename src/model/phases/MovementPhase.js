import { EndPhaseCommand } from "../commands/end_phase_command.js";
import { MoveCommand } from "../commands/move_command.js";
import { Phase } from "./Phase.js";


export class MovementPhase extends Phase {
    constructor(name = "movement") {
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
            unit.validDestinations(hex, game).forEach(to => {
                commands.push(new MoveCommand(to, hex));
            });
        });
        commands.push(new EndPhaseCommand());
        return commands;
    }

    hilightedHexes(game) {
        return this.hilightedHexesForDirectionalCommands(game);
    }

    requiresDeepThought() {
        return true;
    }
}
