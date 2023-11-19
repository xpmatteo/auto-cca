import { Command } from "./commands.js";

class PlayCardCommand extends Command {
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

/** @type {Map<Card, PlayCardCommand>} */
const COMMANDS = new Map();

export function makePlayCardCommand(card) {
    if (!COMMANDS.has(card)) {
        COMMANDS.set(card, new PlayCardCommand(card));
    }
    return COMMANDS.get(card);
}
