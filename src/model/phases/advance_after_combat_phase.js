import { RetreatCommand } from "../commands/retreatCommand.js";
import { Phase } from "../phases/Phase.js";

export class AdvanceAfterCombatPhase  extends Phase {
    toHex;
    fromHex;
    /**
     * @param {Hex} toHex
     * @param {Hex} fromHex
     */
    constructor(toHex, fromHex) {
        super("Advance After Combat");
        this.toHex = toHex;
        this.fromHex = fromHex;
    }

    toString() {
        return `AdvanceAfterCombat ${this.fromHex} to ${this.toHex}`;
    }

    validCommands(game) {
        return [new RetreatCommand(this.toHex, this.fromHex), new RetreatCommand(this.fromHex, this.fromHex)];
    }

    hilightedHexes(game) {
        const toHexes = this.validCommands().
            map(command => command.toHex);
        return new Set(toHexes);
    }

    onClick(hex, interactiveGame) {
        const command = this.validCommands().
            find(command => command.toHex === hex);
        return interactiveGame.executeCommand(command);
    }
}

