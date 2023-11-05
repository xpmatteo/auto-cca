import { Phase } from "./Phase.js";
import {EndPhaseCommand} from "../commands/end_phase_command.js";
import {CloseCombatCommand} from "../commands/close_combat_command.js";
import { RangedCombatCommand } from "../commands/ranged_combat_command.js";


export class FirstDefenderEvasionPhase extends Phase {
    constructor(defenderHex, attackerHex) {
        super("1st defender evasion");
    }

    validCommands(game) {
    }

    hilightedHexes(game) {
    }
}
