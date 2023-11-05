import { Command } from "./commands.js";

export class SkipActionCommand extends Command {
    /**
     * @param {Hex} unitHex
     */
    constructor(unitHex) {
        super();
        this.toHex = unitHex;
    }

    play(game) {
        game.markUnitSpent(game.unitAt(this.toHex));
        return [];
    }

    toString() {
        return `Skip action unit at ${this.toHex}`;
    }
}
