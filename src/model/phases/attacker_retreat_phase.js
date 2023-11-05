import { Hex } from "../../lib/hexlib.js";
import { RetreatCommand } from "../commands/retreatCommand.js";
import { Phase } from "./Phase.js";


export class AttackerRetreatPhase extends Phase {
    /**
     * @param {Hex} defendingHex
     * @param {Hex[]} retreatHexes
     */
    constructor(defendingHex, retreatHexes) {
        super("attacker retreat");
        this.fromHex = defendingHex;
        this.retreatHexes = retreatHexes;
    }

    validCommands(game) {
        return this.retreatHexes.map(toHex => {
            return new RetreatCommand(toHex, this.fromHex);
        });
    }

    hilightedHexes(game) {
        return new Set(this.retreatHexes);
    }

    /**
     * @param {Hex} hex
     * @param {InteractiveGame} interactiveGame
     * @returns {Command|undefined}
     */
    onClick(hex, interactiveGame) {
        return this.validCommands(interactiveGame).
            find(command => command["toHex"] === hex);
    }
}
