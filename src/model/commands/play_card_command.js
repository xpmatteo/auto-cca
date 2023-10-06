import { Command } from "./commands.js";

export class PlayCardCommand extends Command {
    constructor(card) {
        super();
        this.card = card;
    }

    toString() {
        return `PlayCard(${this.card.name})`;
    }

    play(game) {
        return game.playCard(this.card);
    }

    isDeterministic() {
        return true;
    }
}
