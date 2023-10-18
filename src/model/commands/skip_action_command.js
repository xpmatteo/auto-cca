import { Command } from "./commands.js";

export class SkipActionCommand extends Command {
    /**
     * @param {Hex} toHex
     */
    constructor(unitHex) {
        super();
        this.unitHex = unitHex;
    }

    play(game) {
        game.markUnitSpent(game.unitAt(this.toHex));
        return [];
    }

    toString() {
        return `Skip action unit at ${this.unitHex}`;
    }
}
