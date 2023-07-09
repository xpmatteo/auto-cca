import { DamageEvent, FlagIgnoredEvent, UnitKilledEvent } from "../events.js";
import * as dice from "../dice.js";
import { RetreatPhase } from "../phases/RetreatPhase.js";
import { handleFlags } from "./commands.js";

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

        let numberOfFlags = diceResults.filter(r => r === dice.RESULT_FLAG).length;
        let ignorableFlags = game.isSupported(defendingHex) ? 1 : 0;
        let maxDistanceRequired = numberOfFlags * defendingUnit.retreatHexes;
        let retreatPaths = game.retreatPaths(defendingHex, maxDistanceRequired, defendingUnit.side);
        const flagResult = handleFlags(diceResults, defendingUnit.retreatHexes, ignorableFlags, retreatPaths);
        const totalDamage = flagResult.damage +
            defendingUnit.takeDamage(diceResults, false, this.doesSwordsResultInflictDamage(attackingUnit, defendingUnit));

        game.takeDamage(defendingUnit, totalDamage);
        events.push(new DamageEvent(attackingUnit, defendingUnit, defendingHex, totalDamage, diceResults));
        if (game.isUnitDead(defendingUnit)) {
            events.push(new UnitKilledEvent(defendingHex, defendingUnit));
        } else if (flagResult.retreats.length > 0) {
            game.unshiftPhase(new RetreatPhase(defendingUnit.side, defendingHex, flagResult.retreats));
        }
        return events;
    }

}