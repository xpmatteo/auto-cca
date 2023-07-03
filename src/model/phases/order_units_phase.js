import { EndPhaseCommand } from "../commands/endPhaseCommand.js";
import { OrderUnitCommand } from "../commands/order_unit_command.js";
import { Phase } from "./Phase.js";
import { MAP_WIDTH } from "../../view/map.js";
import { CARD_IMAGE_SIZE } from "../cards.js";

export class OrderUnitsPhase extends Phase {
    constructor(numberOfUnits, weight) {
        super(`order ${numberOfUnits} ${weight} units`);
        this.numberOfUnits = numberOfUnits;
        this.weight = weight;
    }

    validCommands(game) {
        let commands = [];
        if (game.numberOfOrderedUnits >= this.numberOfUnits) {
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

    hilightedHexes(game) {
        const hexes = game.validCommands().
            map(command => command.hex).
            filter(hex => hex !== undefined);

        return new Set(hexes);
    }

    onClick(hex, interactiveGame, pixel) {
        if (pixel.x > MAP_WIDTH && pixel.y < MAP_WIDTH + CARD_IMAGE_SIZE.x
            && pixel.y < CARD_IMAGE_SIZE.y) {
            return interactiveGame.undoPlayCard();
        }
        const unit = interactiveGame.unitAt(hex);
        if (interactiveGame.isOrdered(unit)) {
            interactiveGame.unorderUnit(hex);
        } else if (this.hilightedHexes(interactiveGame).has(hex)) {
            interactiveGame.orderUnit(hex);
        }
        return [];
    }
}