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
        this.retreatHexes = retreatHexes;
    }

    validCommands(game) {
        return this.retreatHexes.map(toHex => {
            if (toHex === this.fromHex) {
                return new IgnoreFlagAndBattleBackCommand(this.fromHex, this.attackingHex);
            }
            return new RetreatCommand(toHex, this.fromHex);
        });
    }

    hilightedHexes(game) {
        return new Set(this.retreatHexes);
    }

    /**
     * @param {Hex} hex
     * @param {InteractiveGame} interactiveGame
     * @returns {GameEvent[]}
     */
    onClick(hex, interactiveGame) {
        const command = this.validCommands(interactiveGame).
            find(command => command["toHex"] === hex || command["battleBackHex"] === hex);
        return command ? interactiveGame.executeCommand(command) : [];
    }
}
