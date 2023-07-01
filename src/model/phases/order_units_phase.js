import { EndPhaseCommand } from "../commands/endPhaseCommand.js";
import { OrderUnitCommand } from "../commands/order_unit_command.js";

export class OrderUnitsPhase {
    constructor(numberOfUnits, weight) {
        this.numberOfUnits = numberOfUnits;
        this.weight = weight;
    }

    validCommands(game) {
        let commands = [];
        if (game.orderedUnits.length >= this.numberOfUnits) {
            return [new EndPhaseCommand()];
        }
        game.foreachUnit((unit, hex) => {
            if (unit.weight === this.weight && unit.side === game.currentSide && !game.isOrdered(unit)) {
                commands.push(new OrderUnitCommand(hex));
            }
        });
        commands.push(new EndPhaseCommand());
        return commands;
    }
}