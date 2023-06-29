import { hexScore } from "./commands.js";
import { BattleBackEvent, DamageEvent, UnitKilledEvent } from "../events.js";
import * as dice from "../dice.js";
import { RetreatPhase } from "../phases/RetreatPhase.js";

export class RangedCombatCommand {
    constructor(toHex, fromHex) {
        this.toHex = toHex;
        this.fromHex = fromHex;
    }

    toString() {
        return `Ranged Combat from ${this.fromHex} to ${this.toHex}`;
    }

    isDeterministic() {
        return false;
    }

    value(game) {
        const defendingUnit = game.unitAt(this.toHex);
        return hexScore(game.unitStrength(defendingUnit));
    }

    play(game) {
        const defendingHex = this.toHex;
        const attackingHex = this.fromHex;
        const attackingUnit = game.unitAt(attackingHex);
        if (!attackingUnit) {
            throw new Error(`No unit at ${attackingHex}`);
        }
        const defendingUnit = game.unitAt(defendingHex);
        if (!defendingUnit) {
            throw new Error(`No unit at ${defendingHex}`);
        }
        if (attackingUnit.side === defendingUnit.side) {
            throw new Error(`Cannot attack own unit at ${defendingHex}`);
        }
        if (defendingHex === attackingHex) {
            throw new Error(`Cannot attack self at ${defendingHex}`);
        }
        if (defendingHex.distance(attackingHex) !== 2) {
            throw new Error(`Cannot Ranged Combat with unit at ${defendingHex} from ${attackingHex} (distance is not 2)`);
        }
        let events = [];
        const diceResults = game.roll(2);
        const damage = game.takeDamage(defendingHex,
            diceResults,
            game.retreatHexes(defendingHex).length === 0,
            false);
        // events.push(new DamageEvent(attackingUnit, defendingUnit, defendingHex, damage, diceResults));
        game.markUnitSpent(attackingUnit);

        // if (game.isDead(defendingUnit)) {
        //     events.push(new UnitKilledEvent(defendingHex, defendingUnit));
        // } else if (game.retreatHexes(defendingHex).length !== 0 && diceResults.includes(dice.RESULT_FLAG)) {
        //     const retreatHexes = game.retreatHexes(defendingHex);
        //     game.unshiftPhase(new RetreatPhase(defendingUnit.side, defendingHex, retreatHexes));
        // }
        return events;
    }
}