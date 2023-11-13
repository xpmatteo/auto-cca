import { FirstDefenderRetreatCommand } from "../commands/FirstDefenderRetreatCommand.js";
import { Phase } from "./Phase.js";
import { RetreatCommand } from "../commands/retreatCommand.js";
import { Side } from "../side.js";
import { Hex } from "../../lib/hexlib.js";
import { IgnoreFlagAndBattleBackCommand } from "../commands/abstract_combat_command.js";


export class FirstDefenderRetreatPhase extends Phase {
    /**
     * @param {Hex} attackingHex if battle back is possible, otherwise null
     * @param {Side} retreatingSide
     * @param {Hex} defendingHex
     * @param {Hex[]} retreatHexes
     */
    constructor(attackingHex, retreatingSide, defendingHex, retreatHexes) {
        super("retreat");
        this.attackingHex = attackingHex;
        this.temporarySide = retreatingSide;
        this.fromHex = defendingHex;
        this.retreatHexes = retreatHexes;
    }

    validCommands(game) {
        return this.retreatHexes.map(toHex => {
            if (toHex === this.fromHex && this.attackingHex) {
                return new IgnoreFlagAndBattleBackCommand(this.fromHex, this.attackingHex);
            }
            return new FirstDefenderRetreatCommand(toHex, this.fromHex, this.attackingHex);
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
            find(command => command["toHex"] === hex || command["battleBackHex"] === hex);
    }
}