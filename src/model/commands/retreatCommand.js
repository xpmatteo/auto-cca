import { Command } from "./commands.js";

export class RetreatCommand extends Command {
    constructor(toHex, fromHex) {
        super();
        this.toHex = toHex;
        this.fromHex = fromHex;
    }

    play(game) {
        game.moveUnit(this.toHex, this.fromHex);
        game.markUnitSpent(game.unitAt(this.toHex));
        game.addMovementTrail(this.toHex, this.fromHex);
        game.shiftPhase();
        return [];
    }

    toString() {
        return `Retreat ${this.fromHex} to ${this.toHex}`;
    }

    isDeterministic() {
        return true;
    }
}
