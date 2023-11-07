import { Hex } from "../../lib/hexlib.js";
import { Command } from "./commands.js";

export class AskOpponentIfTheyIntendToEvadeCommand extends Command {
    /**
     * @param {Hex} hex
     */
    constructor(hex) {
        super();
        this.hex = hex;
    }

    toString() {
        return `Ask opponent if they intend to evade from ${this.hex}`;
    }
}
