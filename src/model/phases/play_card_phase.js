import { Phase } from "./Phase.js";
import { PlayCardCommand } from "../commands/play_card_command.js";

export class PlayCardPhase extends Phase {
    constructor() {
        super("play one card");
    }

    validCommands(game, board) {
        return game.hand().map(card => new PlayCardCommand(card));
    }

    hilightedHexes(game) {
        return new Set();
    }

    onClick(hex, interactiveGame) {
        console.log(`PlayCardPhase.onClick(${hex})`, interactiveGame.validCommands());
        const index = hex.q/3;
        const events = interactiveGame.validCommands()[index].play(interactiveGame);
        console.log(`After PlayCardPhase.onClick(${hex})`, interactiveGame.phases);
        return events;
    }

}
