import { Command } from "./commands.js";

export class OrderUnitCommand extends Command {
    constructor(hex) {
        super();
        this.hex = hex;
    }

    toString() {
        return `OrderUnit(${this.hex})`;
    }

    play(game) {
        game.orderUnit(this.hex);
        return [];
    }

    isDeterministic() {
        return true;
    }
}
