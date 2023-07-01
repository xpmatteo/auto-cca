import { DamageEvent, UnitKilledEvent } from "../events.js";
import * as dice from "../dice.js";
import { RetreatPhase } from "../phases/RetreatPhase.js";

export class AbstractCombatCommand {
    constructor() {
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

    attack(attackingUnit, defendingHex, defendingUnit, game) {
        let events = [];
        const diceCount = this.decideDiceCount(attackingUnit, game);
        const diceResults = game.roll(diceCount);
        const damage = game.takeDamage(defendingHex,
            diceResults,
            game.retreatHexes(defendingHex).length === 0,
            this.doesSwordsResultInflictDamage(attackingUnit, defendingUnit));
        events.push(new DamageEvent(attackingUnit, defendingUnit, defendingHex, damage, diceResults));
        game.markUnitSpent(attackingUnit);
        if (game.isDead(defendingUnit)) {
            events.push(new UnitKilledEvent(defendingHex, defendingUnit));
        } else if (game.retreatHexes(defendingHex).length !== 0 && diceResults.includes(dice.RESULT_FLAG)) {
            const retreatHexes = game.retreatHexes(defendingHex);
            game.unshiftPhase(new RetreatPhase(defendingUnit.side, defendingHex, retreatHexes));
        }
        return events;
    }

}