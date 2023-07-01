import {BattleBackEvent, DamageEvent, UnitKilledEvent} from "../events.js";
import * as dice from "../dice.js";
import {RetreatPhase} from "../phases/RetreatPhase.js";
import {hexScore} from "./commands.js";
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

    value(game) {
        const defendingUnit = game.unitAt(this.toHex);
        return hexScore(game.unitStrength(defendingUnit));
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
        let events = [];
        const diceResults = game.roll(attackingUnit.diceCount);
        const damage = game.takeDamage(defendingHex, diceResults, game.retreatHexes(defendingHex).length === 0);
        events.push(new DamageEvent(attackingUnit, defendingUnit, defendingHex, damage, diceResults));
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
            events.push(new DamageEvent(defendingUnit, attackingUnit, attackingHex, battleBackDamage, battleBackDice));
            if (game.isDead(attackingUnit)) {
                events.push(new UnitKilledEvent(attackingHex, attackingUnit));
            }
        }
        return events;
    }

    decideDiceCount(attackingUnit, game) {
        return game.unitHasMoved(this.fromHex) ? 1 : 2;
    }
}