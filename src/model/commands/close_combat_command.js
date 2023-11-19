import { Hex } from "../../lib/hexlib.js";
import { RESULT_LIGHT } from "../dice.js";
import { BattleBackEvent, DamageEvent, UnitKilledEvent } from "../events.js";
import { MomentumAdvancePhase } from "../phases/MomentumAdvancePhase.js";
import { AttackerRetreatPhase } from "../phases/attacker_retreat_phase.js";
import { FirstDefenderRetreatPhase } from "../phases/FirstDefenderRetreatPhase.js";
import { AbstractCombatCommand } from "./abstract_combat_command.js";

class CloseCombatCommand extends AbstractCombatCommand {
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

    decideDiceCount(attackingUnit, game) {
        return attackingUnit.diceCount;
    }

    doesSwordsResultInflictDamage(attackingUnit, defendingUnit) {
        return attackingUnit.weight != RESULT_LIGHT;
    }

    static make(toHex, fromHex) {
        if (!CLOSE_COMBAT_COMMANDS.has(toHex)) {
            CLOSE_COMBAT_COMMANDS.set(toHex, new Map());
        }
        if (!CLOSE_COMBAT_COMMANDS.get(toHex).has(fromHex)) {
            CLOSE_COMBAT_COMMANDS.get(toHex).set(fromHex, new CloseCombatCommand(toHex, fromHex));
        }
        return CLOSE_COMBAT_COMMANDS.get(toHex).get(fromHex);
    }
}

/** @type {Map<Hex, Map<Hex, CloseCombatCommand>>} */
const CLOSE_COMBAT_COMMANDS = new Map();

export function makeCloseCombatCommand(toHex, fromHex) {
    return CloseCombatCommand.make(toHex, fromHex);
}
