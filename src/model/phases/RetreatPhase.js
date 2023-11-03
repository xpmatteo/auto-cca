import { Phase } from "./Phase.js";
import { RetreatCommand } from "../commands/retreatCommand.js";
import { Side } from "../side.js";
import { Hex } from "../../lib/hexlib.js";
import { IgnoreFlagAndBattleBackCommand } from "../commands/abstract_combat_command.js";


export class RetreatPhase extends Phase {
    /**
     * @param {Hex} attackingHex
     * @param {Side} defendingSide
     * @param {Hex} defendingHex
     * @param {Hex[]} retreatHexes
     */
    constructor(attackingHex, defendingSide, defendingHex, retreatHexes) {
        super("retreat");
        this.attackingHex = attackingHex;
        this.temporarySide = defendingSide;
        this.fromHex = defendingHex;
        this.toHexes = retreatHexes;
    }

    validCommands(game) {
        return this.toHexes.map(toHex => {
            if (toHex === this.fromHex) {
                return new IgnoreFlagAndBattleBackCommand(this.fromHex, this.attackingHex);
            }
            return new RetreatCommand(toHex, this.fromHex);
        });
    }

    hilightedHexes(game) {
        return this.hilightedHexesForDirectionalCommands(game);
    }
}
