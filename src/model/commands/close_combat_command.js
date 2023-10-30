import { AdvanceAfterCombatPhase } from "../phases/advance_after_combat_phase.js";
import { BattleBackEvent } from "../events.js";
import { RESULT_LIGHT } from "../dice.js";
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
        const defendingHex = this.toHex;
        const attackingHex = this.fromHex;
        const attackingUnit = game.unitAt(attackingHex);
        const defendingUnit = game.unitAt(defendingHex);
        this.validateCombat(attackingUnit, attackingHex, defendingUnit, defendingHex);
        if (defendingHex.distance(attackingHex) > 1) {
            throw new Error(`Cannot Close Combat with unit at ${defendingHex} from ${attackingHex} (too far)`);
        }
        let events = this.attack(attackingUnit, defendingHex, defendingUnit, game);
        if (this.defenderHoldsGround(game, defendingHex, attackingUnit)) {
            // battle back
            events.push(new BattleBackEvent(attackingHex, defendingHex, defendingUnit.diceCount));
            events = events.concat(this.attack(defendingUnit, attackingHex, attackingUnit, game));
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
}
