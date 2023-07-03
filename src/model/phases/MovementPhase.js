import { Phase } from "./Phase.js";
import {MoveCommand} from "../commands/moveCommand.js";
import {EndPhaseCommand} from "../commands/endPhaseCommand.js";


export class MovementPhase extends Phase {
    constructor() {
        super("movement");
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
}
