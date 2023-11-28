
export class Hand {
    /** @param {Card[]} cards */
    constructor(cards) {
        this.cards = cards.slice();
        this._sortCards();
    }

    *[Symbol.iterator](){
        for (const card of this.cards) {
            yield card;
        }
    }

    /** @param {Card} card */
    play(card) {
        const index = this.cards.indexOf(card);
        if (-1 === index) {
            throw new Error(`This hand does not contain the card ${card.name}`);
        }
        this.cards.splice(index, 1);
    }

    /** @param {Card} card */
    add(card) {
        this.cards.push(card);
        this._sortCards();
    }

    _sortCards() {
        this.cards.sort((a, b) => a.order - b.order);
    }
}
