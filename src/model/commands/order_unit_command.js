import { Hex } from "../../lib/hexlib.js";
import { Command } from "./commands.js";

export class OrderUnitCommand extends Command {
    /**
     * @param {Hex[]} hexes
     */
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

/** @type {Map<Hex, OrderUnitCommand>} */
const ORDER_UNIT_COMMANDS = new Map();
/**
 * @param {Hex[]} hexes
 * @returns {OrderUnitCommand}
 */
export function makeOrderUnitCommand(hexes) {
    return new OrderUnitCommand(hexes);
}
