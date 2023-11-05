import { RESULT_LIGHT } from "../dice.js";
import { AdvanceAfterCombatPhase } from "../phases/advance_after_combat_phase.js";
import { BattleBackEvent, DamageEvent, GameEvent, UnitKilledEvent } from "../events.js";
import * as dice from "../dice.js";
import { FirstDefenderRetreatPhase } from "../phases/FirstDefenderRetreatPhase.js";
import { Command, handleFlags } from "./commands.js";
import { Hex } from "../../lib/hexlib.js";

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
     * @param {Hex} defendingHex
     * @param {Unit} defendingUnit
     * @param {Game} game
     * @returns {GameEvent[]}
     */
    attack(attackingUnit, defendingHex, defendingUnit, game) {
        let totalDamage, retreatHexes, diceResults;
        [totalDamage, retreatHexes, diceResults] = this.simpleAttack(attackingUnit, defendingHex, defendingUnit, game);
        let events = [];
        let isBattleBack = attackingUnit.side !== game.currentSide;
        game.damageUnit(defendingUnit, totalDamage);
        events.push(new DamageEvent(attackingUnit, defendingUnit, defendingHex, totalDamage, diceResults));
        const attackingHex = game.hexOfUnit(attackingUnit);
        if (game.isUnitDead(defendingUnit)) {
            events.push(new UnitKilledEvent(defendingHex, defendingUnit));
            if (!isBattleBack) {
                game.unshiftPhase(new AdvanceAfterCombatPhase(defendingHex, attackingHex));
            }
        } else if (retreatHexes.length > 0) {
            if (!isBattleBack) {
                game.unshiftPhase(new AdvanceAfterCombatPhase(defendingHex, attackingHex));
            }
            const preventRecursiveBattleBack = isBattleBack ? null : attackingHex;
            game.unshiftPhase(new FirstDefenderRetreatPhase(preventRecursiveBattleBack, defendingUnit.side, defendingHex, retreatHexes));
        }
        return events;
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


export class IgnoreFlagAndBattleBackCommand extends AbstractCombatCommand {
    /**
     * @param {Hex} battleBackHex
     * @param {Hex} originalAttackerHex
     */
    constructor(battleBackHex, originalAttackerHex) {
        super();
        this.battleBackHex = battleBackHex;
        this.originalAttackerHex = originalAttackerHex;
    }

    toString() {
        return `Ignore Flag and Battle Back from ${this.battleBackHex} to ${this.originalAttackerHex}`;
    }

    play(game) {
        const battleBackUnit = game.unitAt(this.battleBackHex);
        const originalAttacker = game.unitAt(this.originalAttackerHex);
        /** @type {GameEvent[]} */
        let events = [];

        events.push(new BattleBackEvent(this.originalAttackerHex, this.battleBackHex, battleBackUnit.diceCount));
        events = events.concat(this.attack(battleBackUnit, this.originalAttackerHex, originalAttacker, game));
        game.shiftPhase();
        return events;
    }

    decideDiceCount(attackingUnit, game) {
        return attackingUnit.diceCount;
    }

    doesSwordsResultInflictDamage(attackingUnit, defendingUnit) {
        return attackingUnit.weight !== RESULT_LIGHT;
    }
}
