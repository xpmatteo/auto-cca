import { Hex } from "../../lib/hexlib.js";
import { EvadeCommand } from "../commands/EvadeCommand.js";
import { FirstDefenderDoesNotEvadeCommand } from "../commands/FirstDefenderDoesNotEvadeCommand.js";
import { Phase } from "./Phase.js";


export class FirstDefenderEvasionPhase extends Phase {
    /**
     * @param {Hex[]} toHexes
     * @param {Hex} fromHex
     */
    constructor(toHexes, fromHex, attackerHex) {
        super("1st defender evasion");
        this.toHexes = toHexes;
        this.fromHex = fromHex;
        this.attackerHex = attackerHex;
    }

    /**
     * @param {Game} game
     * @returns {Command[]}
     */
    validCommands(game) {
        /** @type {Command[]} */
        const seed = [new FirstDefenderDoesNotEvadeCommand(this.fromHex, this.attackerHex)];
        return seed.concat(
            this.toHexes.map(h => new EvadeCommand(h, this.fromHex))
        );
    }

    /**
     * @param {Game} game
     * @returns {Set<Hex>}
     */
    hilightedHexes(game) {
        return new Set([this.fromHex].concat(this.toHexes));
    }

    /**
     * @param {InteractiveGame} interactiveGame
     * @returns {Command|undefined}
     */
    onClick(hex, interactiveGame) {
        if (hex === this.fromHex) {
            return new FirstDefenderDoesNotEvadeCommand(this.fromHex, this.attackerHex);
        }
        return this.toHexes
            .filter(toHex => toHex === hex)
            .map(toHex => new EvadeCommand(toHex, this.fromHex))[0];
    }
}
