import {BattleBackEvent, DamageEvent, UnitKilledEvent} from "../events.js";
import * as dice from "../dice.js";
import {RetreatPhase} from "../phases/RetreatPhase.js";
import {hexScore} from "./commands.js";

export class CloseCombatCommand {
    constructor(toHex, fromHex) {
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
        if (defendingHex.distance(attackingHex) > 1) {
            throw new Error(`Cannot Close Combat with unit at ${defendingHex} from ${attackingHex} (too far)`);
        }
        let events = [];
        const diceResults = game.roll(attackingUnit.diceCount);
        const damage = game.takeDamage(defendingHex, diceResults, game.retreatHexes(defendingHex).length === 0);
        events.push(new DamageEvent(defendingHex, damage, diceResults));
        game.markUnitSpent(attackingUnit);

        if (game.isDead(defendingUnit)) {
            events.push(new UnitKilledEvent(defendingHex, defendingUnit));
        } else if (game.retreatHexes(defendingHex).length !== 0 && diceResults.includes(dice.RESULT_FLAG)) {
            const retreatHexes = game.retreatHexes(defendingHex);
            game.unshiftPhase(new RetreatPhase(defendingUnit.side, defendingHex, retreatHexes));
        } else {
            // battle back
            const battleBackDice = game.roll(defendingUnit.diceCount);
            const battleBackDamage = game.takeDamage(attackingUnit, battleBackDice);
            events.push(new BattleBackEvent(attackingHex, defendingHex, battleBackDice.length));
            events.push(new DamageEvent(attackingHex, battleBackDamage, battleBackDice));
            if (game.isDead(attackingUnit)) {
                events.push(new UnitKilledEvent(attackingHex, attackingUnit));
            }
        }
        return events;
    }

    value(game) {
        const defendingUnit = game.unitAt(this.toHex);
        return hexScore(game.unitStrength(defendingUnit));
    }
}