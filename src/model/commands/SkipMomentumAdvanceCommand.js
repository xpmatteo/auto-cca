import { Command } from "./commands.js";

export class SkipMomentumAdvanceCommand extends Command {
    constructor(toHex) {
        super();
        this.toHex = toHex;
    }

    play(game) {
        game.shiftPhase();
        return [];
    }

    toString() {
        return `Skip Momentum Advance`;
    }
}
