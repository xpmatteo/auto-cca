import { RESULT_LIGHT } from "../dice.js";
import { BattleBackEvent, DamageEvent, UnitKilledEvent } from "../events.js";
import { MomentumAdvancePhase } from "../phases/advance_after_combat_phase.js";
import { AttackerRetreatPhase } from "../phases/attacker_retreat_phase.js";
import { FirstDefenderEvasionPhase } from "../phases/FirstDefenderEvasionPhase.js";
import { FirstDefenderRetreatPhase } from "../phases/FirstDefenderRetreatPhase.js";
import { AbstractCombatCommand } from "./abstract_combat_command.js";

export class CloseCombatCommand extends AbstractCombatCommand {
    constructor(toHex, fromHex) {
        super();
        this.toHex = toHex;
        this.fromHex = fromHex;
    }

    toString() {
        return `Close Combat from ${this.fromHex} to ${this.toHex}`;
    }

    play(game) {
        let totalDamage, retreatHexes, diceResults;
        const defendingHex = this.toHex;
        const attackingHex = this.fromHex;
        const attackingUnit = game.unitAt(attackingHex);
        const defendingUnit = game.unitAt(defendingHex);
        this.validateCombat(attackingUnit, attackingHex, defendingUnit, defendingHex);
        if (defendingHex.distance(attackingHex) > 1) {
            throw new Error(`Cannot Close Combat with unit at ${defendingHex} from ${attackingHex} (too far)`);
        }

        if (defendingUnit.canEvade(attackingUnit) && this.hasRoomToEvade(defendingHex, game)) {
            game.unshiftPhase(new FirstDefenderEvasionPhase(defendingHex, attackingHex));
            return [];
        }

        const events = [];
        [totalDamage, retreatHexes, diceResults] =
            this.simpleAttack(attackingUnit, defendingHex, defendingUnit, game);
        events.push(new DamageEvent(attackingUnit, defendingUnit, defendingHex, totalDamage, diceResults));
        game.damageUnit(defendingUnit, totalDamage);
        if (game.isUnitDead(defendingUnit)) {
            events.push(new UnitKilledEvent(defendingUnit, defendingHex));
            game.unshiftPhase(new MomentumAdvancePhase(defendingHex, attackingHex));
        } else if (retreatHexes.length > 0) {
            game.unshiftPhase(new FirstDefenderRetreatPhase(attackingHex, defendingUnit.side, defendingHex, retreatHexes));
        } else {
            // battle back
            [totalDamage, retreatHexes, diceResults] =
                this.simpleAttack(defendingUnit, attackingHex, attackingUnit, game);
            events.push(new BattleBackEvent(attackingHex, defendingHex, defendingUnit.diceCount));
            events.push(new DamageEvent(defendingUnit, attackingUnit, attackingHex, totalDamage, diceResults));
            game.damageUnit(attackingUnit, totalDamage);
            if (game.isUnitDead(attackingUnit)) {
                events.push(new UnitKilledEvent(attackingUnit, attackingHex));
            } else if (retreatHexes.length > 0) {
                game.unshiftPhase(new AttackerRetreatPhase(attackingHex, retreatHexes));
            }
        }
        game.markUnitSpent(attackingUnit);
        return events;
    }

    defenderHoldsGround(game, defendingHex, attackingUnit) {
        return game.unitAt(defendingHex) && this.noRetreat(game, attackingUnit);
    }

    noRetreat(game, attackingUnit) {
        return game.currentSide === attackingUnit.side;
    }

    decideDiceCount(attackingUnit, game) {
        return attackingUnit.diceCount;
    }

    doesSwordsResultInflictDamage(attackingUnit, defendingUnit) {
        return attackingUnit.weight != RESULT_LIGHT;
    }

    hasRoomToEvade(defendingHex, game) {
        return false;
    }
}
