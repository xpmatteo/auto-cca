import { Hex } from "../../lib/hexlib.js";
import { FirstDefenderEvasionPhase } from "../phases/FirstDefenderEvasionPhase.js";
import { Side } from "../side.js";
import { Command } from "./commands.js";

export class CloseCombatWithEvasionCommand extends Command {
    /**
     * @param {Side} defendingSide
     * @param {Hex} toHex defender's hex
     * @param {Hex} fromHex attacker's hex
     */
    constructor(defendingSide, toHex, fromHex) {
        super();
        this.defendingSide = defendingSide;
        this.toHex = toHex;
        this.fromHex = fromHex;
    }

    play(game) {
        game.unshiftPhase(new FirstDefenderEvasionPhase(this.defendingSide, game.evasionPaths(this.toHex), this.toHex, this.fromHex));
        return [];
    }

    toString() {
        return `Give opponent a change to evade from ${this.toHex}`;
    }
}
