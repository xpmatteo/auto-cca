import { Hex } from "../../lib/hexlib.js";
import { Command } from "./commands.js";

class SkipMomentumAdvanceCommand extends Command {
    constructor(inHex) {
        super();
        this.inHex = inHex;
    }

    play(game) {
        game.shiftPhase();
        return [];
    }

    toString() {
        return `Skip Momentum Advance in ${this.inHex}`;
    }

    get toHex() {
        return this.inHex;
    }

    static make(toHex) {
        if (!COMMANDS.has(toHex)) {
            COMMANDS.set(toHex, new SkipMomentumAdvanceCommand(toHex));
        }
        return COMMANDS.get(toHex);
    }
}

/** @type {Map<Hex, SkipMomentumAdvanceCommand>} */
const COMMANDS = new Map();

/**
 * @param {Hex} inHex
 * @returns {SkipMomentumAdvanceCommand}
 */
export function makeSkipMomentumAdvanceCommand(inHex) {
    return SkipMomentumAdvanceCommand.make(inHex);
}
