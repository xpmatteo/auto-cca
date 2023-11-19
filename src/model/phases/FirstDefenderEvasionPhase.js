import { Hex } from "../../lib/hexlib.js";
import { makeEvadeCommand } from "../commands/EvadeCommand.js";
import { FirstDefenderDoesNotEvadeCommand } from "../commands/FirstDefenderDoesNotEvadeCommand.js";
import { Side } from "../side.js";
import { Phase } from "./Phase.js";


export class FirstDefenderEvasionPhase extends Phase {
    /**
     * @param {Side} temporarySide
     * @param {Hex[]} toHexes
     * @param {Hex} fromHex
     * @param {Hex} attackerHex
     */
    constructor(temporarySide, toHexes, fromHex, attackerHex) {
        super("evasion");
        this.temporarySide = temporarySide;
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
            this.toHexes.map(h => makeEvadeCommand(h, this.fromHex, this.attackerHex))
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
            .map(toHex => makeEvadeCommand(toHex, this.fromHex, this.attackerHex))[0];
    }
}
