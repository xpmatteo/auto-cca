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

    isDeterministic() {
        return true;
    }
}
