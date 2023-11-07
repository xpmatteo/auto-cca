import { CloseCombatCommand } from "./close_combat_command.js";
import { Command } from "./commands.js";

function assertDefined(hex) {
    if (hex === undefined) {
        throw new Error(`Hex is undefined`);
    }
    return hex;
}

export class FirstDefenderDoesNotEvadeCommand extends Command {
    constructor(defenderHex, attackerHex) {
        super();
        this.defenderHex = assertDefined(defenderHex);
        this.attackerHex = assertDefined(attackerHex);
    }

    play(game) {
        game.shiftPhase();
        return new CloseCombatCommand(this.defenderHex, this.attackerHex).play(game);
    }

    toString() {
        return "FirstDefenderDoesNotEvade";
    }
}
