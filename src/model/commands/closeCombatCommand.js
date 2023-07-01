import {BattleBackEvent, DamageEvent, UnitKilledEvent} from "../events.js";
import * as dice from "../dice.js";
import {RetreatPhase} from "../phases/RetreatPhase.js";
import {hexScore} from "./commands.js";
import { AbstractCombatCommand } from "./abstract_combat_command.js";
import { RESULT_LIGHT } from "../dice.js";

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
        let events = this.attack(attackingUnit, defendingHex, defendingUnit, game);
        if (this.defenderHoldsGround(game, defendingHex, attackingUnit)) {
            // battle back
            const battleBackDice = game.roll(defendingUnit.diceCount);
            const battleBackDamage = game.takeDamage(attackingUnit, battleBackDice);
            events.push(new BattleBackEvent(attackingHex, defendingHex, battleBackDice.length));
            events.push(new DamageEvent(defendingUnit, attackingUnit, attackingHex, battleBackDamage, battleBackDice));
            if (game.isDead(attackingUnit)) {
                events.push(new UnitKilledEvent(attackingHex, attackingUnit));
            }
        } else {
            // advance after combat
        }
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