import { hexScore } from "./commands.js";

export class RangedCombatCommand {
    constructor(toHex, fromHex) {
        this.toHex = toHex;
        this.fromHex = fromHex;
    }

    toString() {
        return `Ranged Combat from ${this.fromHex} to ${this.toHex}`;
    }

    isDeterministic() {
        return false;
    }

    value(game) {
        const defendingUnit = game.unitAt(this.toHex);
        return hexScore(game.unitStrength(defendingUnit));
    }

    play(game) {
        
    }
}