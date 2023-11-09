import { Hex } from "../../lib/hexlib.js";
import { FirstDefenderEvasionPhase } from "../phases/FirstDefenderEvasionPhase.js";
import { Command } from "./commands.js";

export class CloseCombatWithEvasionCommand extends Command {
    /**
     * @param {Hex} toHex defender's hex
     * @param {Hex} fromHex attacker's hex
     */
    constructor(toHex, fromHex) {
        super();
        this.toHex = toHex;
        this.fromHex = fromHex;
    }

    play(game) {
        game.unshiftPhase(new FirstDefenderEvasionPhase(game.evasionPaths(this.toHex), this.toHex, this.fromHex));
        return [];
    }

    toString() {
        return `Give opponent a change to evade from ${this.toHex}`;
    }
}
