import { Hex } from "../../lib/hexlib.js";
import { Command } from "./commands.js";

class MomentumAdvanceCommand extends Command {
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
        return `Momentum advance ${this.fromHex} to ${this.toHex}`;
    }
}

/** @type {Map<Hex, Map<Hex, MomentumAdvanceCommand>>} */
const MOMENTUM_ADVANCE_COMMANDS = new Map();

export function makeMomentumAdvanceCommand(toHex, fromHex) {
    if (!MOMENTUM_ADVANCE_COMMANDS.has(toHex)) {
        MOMENTUM_ADVANCE_COMMANDS.set(toHex, new Map());
    }
    if (!MOMENTUM_ADVANCE_COMMANDS.get(toHex).has(fromHex)) {
        MOMENTUM_ADVANCE_COMMANDS.get(toHex).set(fromHex, new MomentumAdvanceCommand(toHex, fromHex));
    }
    return MOMENTUM_ADVANCE_COMMANDS.get(toHex).get(fromHex);
}
