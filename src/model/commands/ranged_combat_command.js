import { Hex } from "../../lib/hexlib.js";
import { DamageEvent, UnitKilledEvent } from "../events.js";
import { FirstDefenderRetreatPhase } from "../phases/FirstDefenderRetreatPhase.js";
import { RangedCombatRetreatPhase } from "../phases/RangedCombatRetreatPhase.js";
import { AbstractCombatCommand } from "./abstract_combat_command.js";

class RangedCombatCommand extends AbstractCombatCommand {
    constructor(toHex, fromHex) {
        super();
        this.toHex = toHex;
        this.fromHex = fromHex;
    }

    toString() {
        return `Ranged Combat from ${this.fromHex} to ${this.toHex}`;
    }

    play(game) {
        const defendingHex = this.toHex;
        const attackingHex = this.fromHex;
        const attackingUnit = game.unitAt(attackingHex);
        const defendingUnit = game.unitAt(defendingHex);
        this.validateCombat(attackingUnit, attackingHex, defendingUnit, defendingHex);
        const distance = defendingHex.distance(attackingHex);
        if (distance < 2 || distance > attackingUnit.range) {
            throw new Error(`Cannot Ranged Combat with unit at ${defendingHex} from ${attackingHex}`);
        }
        game.markUnitSpent(attackingUnit);

        let totalDamage, retreatHexes, diceResults;
        [totalDamage, retreatHexes, diceResults] = this.simpleAttack(attackingUnit, defendingHex, defendingUnit, game);
        let events = [];
        game.damageUnit(defendingUnit, totalDamage);
        events.push(new DamageEvent(attackingUnit, defendingUnit, defendingHex, totalDamage, diceResults));
        if (game.isUnitDead(defendingUnit)) {
            events.push(new UnitKilledEvent(defendingHex, defendingUnit));
        } else if (retreatHexes.length > 0) {
            game.unshiftPhase(new RangedCombatRetreatPhase(defendingHex, retreatHexes));
        }
        return events;
    }

    decideDiceCount(attackingUnit, game) {
        return game.unitHasMoved(this.fromHex) ? 1 : 2;
    }

    doesSwordsResultInflictDamage(attackingUnit, defendingUnit) {
        return false;
    }

    static make(toHex, fromHex) {
        if (!RANGED_COMBAT_COMMANDS.has(toHex)) {
            RANGED_COMBAT_COMMANDS.set(toHex, new Map());
        }
        if (!RANGED_COMBAT_COMMANDS.get(toHex).has(fromHex)) {
            RANGED_COMBAT_COMMANDS.get(toHex).set(fromHex, new RangedCombatCommand(toHex, fromHex));
        }
        return RANGED_COMBAT_COMMANDS.get(toHex).get(fromHex);
    }
}

/** @type {Map<Hex, Map<Hex, RangedCombatCommand>>} */
const RANGED_COMBAT_COMMANDS = new Map();

export function makeRangedCombatCommand(toHex, fromHex) {
    return RangedCombatCommand.make(toHex, fromHex);
}
