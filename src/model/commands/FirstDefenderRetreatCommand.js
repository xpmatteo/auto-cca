import { MomentumAdvancePhase } from "../phases/advance_after_combat_phase.js";
import { Command } from "./commands.js";

export class FirstDefenderRetreatCommand extends Command {
    constructor(toHex, fromHex, attackerHex) {
        super();
        this.toHex = toHex;
        this.fromHex = fromHex;
        this.attackerHex = attackerHex;
    }

    play(game) {
        game.moveUnit(this.toHex, this.fromHex);
        game.addMovementTrail(this.toHex, this.fromHex);
        game.shiftPhase();
        game.unshiftPhase(new MomentumAdvancePhase(this.fromHex, this.attackerHex));
        return [];
    }

    toString() {
        return `Retreat ${this.fromHex} to ${this.toHex}`;
    }

    isDeterministic() {
        return true;
    }
}
