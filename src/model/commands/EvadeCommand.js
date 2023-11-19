import { Hex } from "../../lib/hexlib.js";
import { DamageEvent, DefenderEvasionEvent, UnitKilledEvent } from "../events.js";
import { Command } from "./commands.js";

class EvadeCommand extends Command {
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
        /** @type {GameEvent[]} */
        const events = [new DefenderEvasionEvent(this.toHex, this.fromHex),
            new DamageEvent(attackingUnit, evadingUnit, this.fromHex, damage, diceResults)];
        if (game.isUnitDead(evadingUnit)) {
            events.push(new UnitKilledEvent(this.fromHex, evadingUnit));
        } else {
            game.moveUnit(this.toHex, this.fromHex);
        }
        game.shiftPhase();
        game.markUnitSpent(attackingUnit);
        return events;
    }

    toString() {
        return `Evade from ${this.fromHex} to ${this.toHex} from attacker ${this.attackerHex}`
    }
}

/** @type {Map<Hex, Map<Hex, Map<Hex, EvadeCommand>>>} */
const COMMANDS = new Map();

/**
 * @param {Hex} toHex
 * @param {Hex} fromHex
 * @param {Hex} attackerHex
 * @returns {EvadeCommand}
 */
export function makeEvadeCommand(toHex, fromHex, attackerHex) {
    if (!COMMANDS.has(toHex)) {
        COMMANDS.set(toHex, new Map());
    }
    const toHexCommands = COMMANDS.get(toHex);
    if (!toHexCommands.has(fromHex)) {
        toHexCommands.set(fromHex, new Map());
    }
    const fromHexCommands = toHexCommands.get(fromHex);
    if (!fromHexCommands.has(attackerHex)) {
        fromHexCommands.set(attackerHex, new EvadeCommand(toHex, fromHex, attackerHex));
    }
    return fromHexCommands.get(attackerHex);
}
