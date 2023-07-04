import { DamageEvent, FlagIgnoredEvent, UnitKilledEvent } from "../events.js";
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
        let diceResults = game.roll(diceCount);
        const originalDiceResults = diceResults.slice();
        const hasFlags = diceResults.includes(dice.RESULT_FLAG);
        if (hasFlags && game.isSupported(defendingHex)) {
            events.push(new FlagIgnoredEvent(defendingUnit, defendingHex));
            diceResults = diceResults.filter(r => r !== dice.RESULT_FLAG);
        }
        const damage = game.takeDamage(defendingUnit,
            diceResults,
            game.retreatHexes(defendingHex).length === 0,
            this.doesSwordsResultInflictDamage(attackingUnit, defendingUnit));
        events.push(new DamageEvent(attackingUnit, defendingUnit, defendingHex, damage, originalDiceResults));
        if (game.isUnitDead(defendingUnit)) {
            events.push(new UnitKilledEvent(defendingHex, defendingUnit));
        } else {
            if (game.retreatHexes(defendingHex).length !== 0 && hasFlags) {
                        const retreatHexes = game.retreatHexes(defendingHex);
                        game.unshiftPhase(new RetreatPhase(defendingUnit.side, defendingHex, retreatHexes));
                    }
        }
        return events;
    }

}