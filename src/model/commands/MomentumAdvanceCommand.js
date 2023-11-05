import { Command } from "./commands.js";

export class MomentumAdvanceCommand extends Command {
    constructor(toHex, fromHex) {
        super();
        this.toHex = toHex;
        this.fromHex = fromHex;
    }

    play(game) {
        game.moveUnit(this.toHex, this.fromHex);
        game.addMovementTrail(this.toHex, this.fromHex);
        game.shiftPhase();
        return [];
    }

    toString() {
        return `Momentum advance ${this.fromHex} to ${this.toHex}`;
    }
}
