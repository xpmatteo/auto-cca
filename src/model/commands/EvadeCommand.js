import { Hex } from "../../lib/hexlib.js";
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


    toString() {
        return `Evade from ${this.fromHex} to ${this.toHex}`
    }
}
