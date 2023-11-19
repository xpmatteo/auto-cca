import { Hex } from "../../lib/hexlib.js";
import { RESULT_LIGHT } from "../dice.js";
import { BattleBackEvent, DamageEvent, UnitKilledEvent } from "../events.js";
import { AttackerRetreatPhase } from "../phases/attacker_retreat_phase.js";
import { AbstractCombatCommand } from "./abstract_combat_command.js";

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
        game.damageUnit(defendingUnit, totalDamage);
        events.push(new DamageEvent(attackingUnit, defendingUnit, defendingHex, totalDamage, diceResults));
        const attackingHex = game.hexOfUnit(attackingUnit);
        if (game.isUnitDead(defendingUnit)) {
            events.push(new UnitKilledEvent(defendingHex, defendingUnit));
        } else if (retreatHexes.length > 0) {
            game.unshiftPhase(new AttackerRetreatPhase(defendingHex, retreatHexes));
        }
        return events;
    }

    play(game) {
        const battleBackUnit = game.unitAt(this.battleBackHex);
        const originalAttacker = game.unitAt(this.originalAttackerHex);
        /** @type {GameEvent[]} */
        let events = [];

        events.push(new BattleBackEvent(this.originalAttackerHex, this.battleBackHex, battleBackUnit.diceCount));
        const otherEvents = this.attack(battleBackUnit, this.originalAttackerHex, originalAttacker, game);
        events = events.concat(otherEvents);
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
