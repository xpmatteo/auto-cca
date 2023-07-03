import { MovementPhase } from "../phases/MovementPhase.js";
import { BattlePhase } from "../phases/BattlePhase.js";

export class PlayCardCommand {
    constructor(card) {
        this.card = card;
    }

    toString() {
        return `PlayCard(${this.card.name})`;
    }

    play(game) {
        return game.playCard(this.card);
    }

    value(game) {
        return 0;
    }

    isDeterministic() {
        return true;
    }
}