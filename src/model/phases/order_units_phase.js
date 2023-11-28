import { CARD_IMAGE_SIZE } from "../../config.js";
import { choose } from "../../lib/combinatorial.js";
import { MAP_WIDTH } from "../../view/map.js";
import { endPhaseCommand } from "../commands/EndPhaseCommand.js";
import { OrderUnitCommand } from "../commands/order_unit_command.js";
import { Phase } from "./Phase.js";
import { Hex } from "../../lib/hexlib.js";

export class DoubleOrderUnitsPhase extends Phase {
    /**
     * @param {OrderUnitsPhase} phase0
     * @param {OrderUnitsPhase} phase1
     */
    constructor(phase0, phase1) {
        super();
        this.phase0 = phase0;
        this.phase1 = phase1;
    }

    /**
     * @param {Game} game
     * @returns {Command[]}
     */
    validCommands(game) {
        return this.phase0.validCommands(game).concat(this.phase1.validCommands(game));
    }

    /* Auto-order units if there is no choice to be made */
    executePreliminaryOperations(game) {
        this.phase0.executePreliminaryOperations(game);
        this.phase1.executePreliminaryOperations(game);
    }

    /**
     * @param {Game} game
     * @returns {Set<Hex>}
     */
    hilightedHexes(game) {
        return new Set([...this.phase0.hilightedHexes(game), ...this.phase1.hilightedHexes(game)]);
    }

    /**
     * @param {Hex} hex
     * @param {InteractiveGame} interactiveGame
     * @param {Point} pixel
     */
    onClick(hex, interactiveGame, pixel) {
        if (pixel.x > MAP_WIDTH && pixel.y < MAP_WIDTH + CARD_IMAGE_SIZE.x
            && pixel.y < CARD_IMAGE_SIZE.y) {
            interactiveGame.undoPlayCard();
        }
        const unit = interactiveGame.unitAt(hex);
        if (interactiveGame.isOrdered(unit)) {
            interactiveGame.unorderUnit(hex);
        } else if (this.hilightedHexes(interactiveGame).has(hex)) {
            interactiveGame.orderUnit(hex);
        }
    }
}

export class OrderUnitsPhase extends Phase {
    /**
     * @param {number} numberOfUnits
     * @param {(Unit, Game)=>boolean} isEligible
     */
    constructor(numberOfUnits, isEligible = null) {
        super(`order ${numberOfUnits} units`);
        this.numberOfUnits = numberOfUnits;
        this.isEligible = isEligible;
    }

    /**
     * @param {Game} game
     * @returns {Command[]}
     */
    validCommands(game) {
        if (this.__orderedUnits() >= this.numberOfUnits) {
            return [endPhaseCommand()];
        }
        const hexes = [];
        game.foreachUnit((unit, hex) => {
            if (this.__isEligible(unit, game) && !game.isOrdered(unit)) {
                hexes.push(hex);
            }
        });
        /**
         * @type {Command[]}
         */
        const commands = choose(hexes, this.numberOfUnits - game.numberOfOrderedUnits)
            .map(combination => new OrderUnitCommand(combination));
        if (commands.length === 0)
            commands.push(endPhaseCommand());
        return commands;
    }

    /* Auto-order units if there is no choice to be made */
    executePreliminaryOperations(game) {
        if (this.__eligibleUnits(game).length <= this.numberOfUnits) {
            this.__orderAllUnits(game);
        }
    }

    /**
     * @param {Game} game
     * @returns {Set<Hex>}
     */
    hilightedHexes(game) {
        if (this.__orderedUnits(game) >= this.numberOfUnits) {
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
            interactiveGame.undoPlayCard();
        }
        const unit = interactiveGame.unitAt(hex);
        if (interactiveGame.isOrdered(unit)) {
            interactiveGame.unorderUnit(hex);
        } else if (this.hilightedHexes(interactiveGame).has(hex)) {
            interactiveGame.orderUnit(hex);
        }
    }

    __isEligible(unit, game) {
        return this.isEligible(unit, game) && unit.side === game.currentSide;
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

    __orderedUnits(game) {
        return game.toGame().orderedUnits.filter(unit => this.__isEligible(unit, game)).length;
    }
}
