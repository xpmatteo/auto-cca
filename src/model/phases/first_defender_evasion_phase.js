import { Phase } from "./Phase.js";


export class FirstDefenderEvasionPhase extends Phase {
    constructor(defenderHex, attackerHex) {
        super("1st defender evasion");
    }

    validCommands(game) {
    }

    hilightedHexes(game) {
    }
}
