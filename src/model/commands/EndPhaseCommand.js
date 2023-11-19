import { Command } from "./commands.js";

class EndPhaseCommand extends Command {
    toString() {
        return `End phase`;
    }

    play(game) {
        return game.endPhase();
    }
}

const END_PHASE_COMMAND = new EndPhaseCommand();

export function endPhaseCommand() { return END_PHASE_COMMAND; }
