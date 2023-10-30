import { AdvanceAfterCombatPhase } from "../phases/advance_after_combat_phase.js";
import { DamageEvent, UnitKilledEvent } from "../events.js";
import * as dice from "../dice.js";
import { RetreatPhase } from "../phases/RetreatPhase.js";
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
     * @returns {GameEvent[]}
     */
    attack(attackingUnit, defendingHex, defendingUnit, game) {
        let events = [];
        const diceCount = this.decideDiceCount(attackingUnit, game);
        let diceResults = game.roll(diceCount);

        let numberOfFlags = diceResults.filter(r => r === dice.RESULT_FLAG).length;
        let ignorableFlags = game.isSupported(defendingHex) ? 1 : 0;
        let maxDistanceRequired = numberOfFlags * defendingUnit.retreatHexes;
        let retreatPaths = game.retreatPaths(defendingHex, maxDistanceRequired, defendingUnit.side);
        const flagResult = handleFlags(numberOfFlags, defendingUnit.retreatHexes, ignorableFlags, retreatPaths);
        const totalDamage = flagResult.damage +
            defendingUnit.takeDamage(diceResults, this.doesSwordsResultInflictDamage(attackingUnit, defendingUnit));

        game.takeDamage(defendingUnit, totalDamage);
        events.push(new DamageEvent(attackingUnit, defendingUnit, defendingHex, totalDamage, diceResults));
        if (game.isUnitDead(defendingUnit)) {
            events.push(new UnitKilledEvent(defendingHex, defendingUnit));
            if (attackingUnit.side === game.currentSide) {
                game.unshiftPhase(new AdvanceAfterCombatPhase(defendingHex, game.hexOfUnit(attackingUnit)));
            }
        } else if (flagResult.retreats.length > 0) {
            if (attackingUnit.side === game.currentSide) {
                game.unshiftPhase(new AdvanceAfterCombatPhase(defendingHex, game.hexOfUnit(attackingUnit)));
            }
            game.unshiftPhase(new RetreatPhase(defendingUnit.side, defendingHex, flagResult.retreats));
        }
        return events;
    }

    doesSwordsResultInflictDamage(attackingUnit, defendingUnit) {
        throw new Error("Abstract method");
    }

    decideDiceCount(attackingUnit, game) {
        throw new Error("Abstract method");
    }

}
