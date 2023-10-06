import { Command } from "./commands.js";

export class EndPhaseCommand extends Command {
    toString() {
        return `End phase`;
    }

    play(game) {
        return game.endPhase();
    }

    isDeterministic() {
        return true;
    }
}
