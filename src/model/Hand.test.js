import {
    ORDER_2_CENTER_CARD, ORDER_2_LEFT_CARD,
    ORDER_2_RIGHT_CARD, ORDER_3_CENTER_CARD,
    ORDER_3_LEFT_CARD, ORDER_3_RIGHT_CARD,
    ORDER_4_CENTER_CARD,
    ORDER_4_LEFT_CARD,
    ORDER_4_RIGHT_CARD
} from "./cards.js";
import { Deck } from "./deck.js";

class Hand {
    /** @param {Card[]} cards */
    constructor(cards) {
        this.cards = cards.slice();
        this.cards.sort((a, b) => a.order - b.order);
    }

    *[Symbol.iterator](){
        for (const card of this.cards) {
            yield card;
        }
    }

    play(card) {
        const index = this.cards.indexOf(card);
        if (-1 === index) {
            throw new Error(`This hand does not contain the card ${card.name}`);
        }
        this.cards = this.cards.splice(index, 1);
    }
}

describe('A hand of cards', () => {

    const deck = new Deck([
        ORDER_4_LEFT_CARD, ORDER_4_CENTER_CARD, ORDER_4_RIGHT_CARD,
        ORDER_3_LEFT_CARD, ORDER_3_CENTER_CARD, ORDER_3_RIGHT_CARD,
        ORDER_2_LEFT_CARD, ORDER_2_CENTER_CARD, ORDER_2_RIGHT_CARD,
    ]);

    const hand = new Hand([ORDER_4_RIGHT_CARD, ORDER_4_LEFT_CARD, ORDER_4_CENTER_CARD]);

    test('enumerating card in order', () => {
        expect([...hand]).toEqual([ORDER_4_LEFT_CARD, ORDER_4_CENTER_CARD, ORDER_4_RIGHT_CARD,])
    });

    xtest('playing a card', () => {
        const hand = new Hand([ORDER_4_LEFT_CARD, ORDER_4_CENTER_CARD, ORDER_4_CENTER_CARD]);

        hand.play(ORDER_4_CENTER_CARD);

        expect([...hand]).toEqual([ORDER_4_LEFT_CARD, ORDER_4_CENTER_CARD,])
    });

    test('adding a card', () => {

    });
});
