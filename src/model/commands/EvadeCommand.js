import { Hex } from "../../lib/hexlib.js";
import { DefenderEvasionEvent } from "../events.js";
import { Command } from "./commands.js";

export class EvadeCommand extends Command {
    /**
     * @param {Hex} toHex
     * @param {Hex} fromHex
     */
    constructor(toHex, fromHex) {
        super();
        this.toHex = toHex;
        this.fromHex = fromHex;
    }

    play(game) {
        game.shiftPhase();
        game.moveUnit(this.toHex, this.fromHex);
        return [new DefenderEvasionEvent(this.toHex, this.fromHex)];
    }

    toString() {
        return `Evade from ${this.fromHex} to ${this.toHex}`
    }
}
