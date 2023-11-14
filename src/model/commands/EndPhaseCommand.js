import { Command } from "./commands.js";

class EndPhaseCommand extends Command {
    toString() {
        return `End phase`;
    }

    play(game) {
        return game.endPhase();
    }
}

export function endPhaseCommand() { return new EndPhaseCommand(); }
