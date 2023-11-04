import { Hex } from "../../lib/hexlib.js";
import { RetreatCommand } from "../commands/retreatCommand.js";
import { Phase } from "./Phase.js";

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
        return `advance after combat`;
    }

    validCommands(game) {
        if (game.unitAt(this.toHex)) {
            return [new RetreatCommand(this.fromHex, this.fromHex)];
        }
        return [new RetreatCommand(this.toHex, this.fromHex), new RetreatCommand(this.fromHex, this.fromHex)];
    }

    hilightedHexes(game) {
        const toHexes = this.validCommands(game).
            map(command => command.toHex);
        return new Set(toHexes);
    }

    onClick(hex, interactiveGame) {
        return this.validCommands(interactiveGame.toGame()).
            find(command => command.toHex === hex);
    }
}

