import { choose } from "../../lib/combinatorial.js";
import { CARD_IMAGE_SIZE } from "../../config.js";
import { EndPhaseCommand } from "../commands/end_phase_command.js";
import { OrderUnitCommand } from "../commands/order_unit_command.js";
import { Phase } from "./Phase.js";
import { MAP_WIDTH } from "../../view/map.js";

export class OrderUnitsPhase extends Phase {
    constructor(numberOfUnits, weight) {
        super(`order ${numberOfUnits} ${weight} units`);
        this.numberOfUnits = numberOfUnits;
        this.weight = weight;
    }

    /**
     * @param {Game} game
     * @returns {Command[]}
     */
    validCommands(game) {
        if (this.__eligibleUnits(game).length <= this.numberOfUnits) {
            this.__orderAllUnits(game);
            return [new EndPhaseCommand()];
        }
        if (game.numberOfOrderedUnits >= this.numberOfUnits) {
            return [new EndPhaseCommand()];
        }
        const hexes = [];
        game.foreachUnit((unit, hex) => {
            if (this.__isEligible(unit, game) && !game.isOrdered(unit)) {
                hexes.push(hex);
            }
        });
        const commands = choose(hexes, this.numberOfUnits - game.numberOfOrderedUnits)
            .map(combination => new OrderUnitCommand(combination));
        if (commands.length === 0)
            commands.push(new EndPhaseCommand());
        return commands;
    }

    /**
     * @param {Game} game
     * @returns {Set<Hex>}
     */
    hilightedHexes(game) {
        if (game.numberOfOrderedUnits >= this.numberOfUnits) {
            return new Set();
        }
        const result = new Set();
        game.foreachUnit((unit, hex) => {
            if (this.__isEligible(unit, game) && !game.isOrdered(unit)) {
                result.add(hex);
            }
        });
        return result;
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

    __isEligible(unit, game) {
        return unit.weight === this.weight && unit.side === game.currentSide;
    }

    __eligibleUnits(game) {
        let units = [];
        game.foreachUnit((unit, hex) => {
            if (this.__isEligible(unit, game)) {
                units.push(unit);
            }
        });
        return units;
    }

    __orderAllUnits(game) {
        game.foreachUnit((unit, hex) => {
            if (this.__isEligible(unit, game) && !game.isOrdered(unit)) {
                game.orderUnit(hex);
            }
        });
    }

    requiresDeepThought() {
        return true;
    }
}
