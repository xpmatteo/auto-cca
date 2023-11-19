import { Hex } from "../../lib/hexlib.js";
import * as dice from "../dice.js";
import { Command, handleFlags } from "./commands.js";

export class AbstractCombatCommand extends Command {
    constructor() {
        super();
        if (this.constructor === AbstractCombatCommand) {
            throw new Error("AbstractCombatCommand is abstract");
        }
    }

    isDeterministic() {
        return false;
    }

    validateCombat(attackingUnit, attackingHex, defendingUnit, defendingHex) {
        if (!attackingUnit) {
            throw new Error(`No unit at ${attackingHex}`);
        }
        if (!defendingUnit) {
            throw new Error(`No unit at ${defendingHex}`);
        }
        if (attackingUnit.side === defendingUnit.side) {
            throw new Error(`Cannot attack own unit at ${defendingHex}`);
        }
        if (defendingHex === attackingHex) {
            throw new Error(`Cannot attack self at ${defendingHex}`);
        }
    }

    /**
     * @param {Unit} attackingUnit
     * @param {Hex} defendingHex
     * @param {Unit} defendingUnit
     * @param {Game} game
     * @returns {[number, Hex[], DiceResult[]]}
     */
    simpleAttack(attackingUnit, defendingHex, defendingUnit, game) {
        const diceCount = this.decideDiceCount(attackingUnit, game);
        let diceResults = game.roll(diceCount);

        let numberOfFlags = diceResults.filter(r => r === dice.RESULT_FLAG).length;
        let ignorableFlags = game.isSupported(defendingHex) ? 1 : 0;
        let maxDistanceRequired = numberOfFlags * defendingUnit.retreatHexes;
        let retreatPaths = game.retreatPaths(defendingHex, maxDistanceRequired, defendingUnit.side);
        const flagResult = handleFlags(numberOfFlags, defendingUnit.retreatHexes, ignorableFlags, retreatPaths);
        const totalDamage = flagResult.damage +
            defendingUnit.calculateDamage(diceResults, this.doesSwordsResultInflictDamage(attackingUnit, defendingUnit));

        return [totalDamage, flagResult.retreats, diceResults];
    }

    /**
     * @param {Unit} attackingUnit
     * @param {Unit} defendingUnit
     * @returns {boolean}
     */
    doesSwordsResultInflictDamage(attackingUnit, defendingUnit) {
        throw new Error("Abstract method");
    }

    /**
     * @param {Unit} attackingUnit
     * @returns {number}
     */
    decideDiceCount(attackingUnit, game) {
        throw new Error("Abstract method");
    }
}
