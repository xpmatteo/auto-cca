import { Hex } from "../../lib/hexlib.js";
import { Command } from "./commands.js";

class RetreatCommand extends Command {
    constructor(toHex, fromHex) {
        super();
        this.toHex = toHex;
        this.fromHex = fromHex;
    }

    play(game) {
        game.moveUnit(this.toHex, this.fromHex);
        game.addMovementTrail(this.toHex, this.fromHex);
        game.shiftPhase();
        return [];
    }

    toString() {
        return `Retreat ${this.fromHex} to ${this.toHex}`;
    }

    isDeterministic() {
        return true;
    }

    static make(toHex, fromHex) {
        if (!RETREAT_COMMANDS.has(toHex)) {
            RETREAT_COMMANDS.set(toHex, new Map());
        }
        if (!RETREAT_COMMANDS.get(toHex).has(fromHex)) {
            RETREAT_COMMANDS.get(toHex).set(fromHex, new RetreatCommand(toHex, fromHex));
        }
        return RETREAT_COMMANDS.get(toHex).get(fromHex);
    }
}

/** @type {Map<Hex, Map<Hex, RetreatCommand>>} */
const RETREAT_COMMANDS = new Map();

export function makeRetreatCommand(toHex, fromHex) {
    return RetreatCommand.make(toHex, fromHex);
}
