import { Command } from "./commands.js";

export class MoveCommand extends Command {
    constructor(toHex, fromHex) {
        super();
        this.toHex = toHex;
        this.fromHex = fromHex;
    }

    toString() {
        return `Move ${this.fromHex} to ${this.toHex}`;
    }

    play(game) {
        game.moveUnit(this.toHex, this.fromHex);
        game.markUnitSpent(game.unitAt(this.toHex));
        game.addMovementTrail(this.toHex, this.fromHex);
        return [];
    }

    isDeterministic() {
        return true;
    }
}
