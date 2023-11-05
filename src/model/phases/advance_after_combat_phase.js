import { Hex } from "../../lib/hexlib.js";
import { MomentumAdvanceCommand } from "../commands/MomentumAdvanceCommand.js";
import { RetreatCommand } from "../commands/retreatCommand.js";
import { SkipMomentumAdvanceCommand } from "../commands/SkipMomentumAdvanceCommand.js";
import { Phase } from "./Phase.js";

export class MomentumAdvancePhase extends Phase {
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
            return [new SkipMomentumAdvanceCommand(this.fromHex)];
        }
        return [new MomentumAdvanceCommand(this.toHex, this.fromHex), new SkipMomentumAdvanceCommand(this.fromHex)];
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

