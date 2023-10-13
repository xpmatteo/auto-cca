import { Command } from "./commands.js";

export class OrderUnitCommand extends Command {
    constructor(hexes) {
        super();
        this.hexes = hexes;
    }

    toString() {
        return `OrderUnit(${this.hexes})`;
    }

    play(game) {
        this.hexes.forEach(hex => game.orderUnit(hex));
        return [];
    }

    isDeterministic() {
        return true;
    }
}
