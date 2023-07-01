import { hexScore } from "./commands.js";
import { BattleBackEvent, DamageEvent, UnitKilledEvent } from "../events.js";
import * as dice from "../dice.js";
import { RetreatPhase } from "../phases/RetreatPhase.js";
import { AbstractCombatCommand } from "./abstract_combat_command.js";

export class RangedCombatCommand extends AbstractCombatCommand {
    constructor(toHex, fromHex) {
        super();
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
        const defendingUnit = game.unitAt(defendingHex);
        this.validateCombat(attackingUnit, attackingHex, defendingUnit, defendingHex);
        if (defendingHex.distance(attackingHex) !== 2) {
            throw new Error(`Cannot Ranged Combat with unit at ${defendingHex} from ${attackingHex} (distance is not 2)`);
        }
        return this.attack(attackingUnit, defendingHex, defendingUnit, game);
    }

    attack(attackingUnit, defendingHex, defendingUnit, game) {
        let events = [];
        const diceCount = this.decideDiceCount(attackingUnit, game);
        const diceResults = game.roll(diceCount);
        const damage = game.takeDamage(defendingHex,
            diceResults,
            game.retreatHexes(defendingHex).length === 0,
            false);
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

    decideDiceCount(attackingUnit, game) {
        return game.unitHasMoved(this.fromHex) ? 1 : 2;
    }
}