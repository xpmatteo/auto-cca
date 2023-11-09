import { Hex } from "../../lib/hexlib.js";
import { DamageEvent, DefenderEvasionEvent } from "../events.js";
import { Command } from "./commands.js";

export class EvadeCommand extends Command {
    /**
     * @param {Hex} toHex
     * @param {Hex} fromHex
     * @param {Hex} attackerHex
     */
    constructor(toHex, fromHex, attackerHex) {
        super();
        this.toHex = toHex;
        this.fromHex = fromHex;
        this.attackerHex = attackerHex;
    }

    play(game) {
        const evadingUnit = game.unitAt(this.fromHex);
        const attackingUnit = game.unitAt(this.attackerHex);
        const diceResults = game.roll(attackingUnit.diceCount);
        const damage = evadingUnit.calculateDamage(diceResults, false);
        game.damageUnit(evadingUnit, damage);
        game.moveUnit(this.toHex, this.fromHex);
        game.endPhase();
        return [new DefenderEvasionEvent(this.toHex, this.fromHex),
        new DamageEvent(attackingUnit, evadingUnit, this.fromHex, damage, diceResults)];
    }

    toString() {
        return `Evade from ${this.fromHex} to ${this.toHex} from attacker ${this.attackerHex}`
    }
}
