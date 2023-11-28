import {
    ORDER_2_CENTER_CARD,
    ORDER_2_LEFT_CARD,
    ORDER_2_RIGHT_CARD,
    ORDER_3_CENTER_CARD,
    ORDER_3_LEFT_CARD,
    ORDER_3_RIGHT_CARD,
    ORDER_4_CENTER_CARD,
    ORDER_4_LEFT_CARD,
    ORDER_4_RIGHT_CARD
} from "./cards.js";
import { Deck } from "./deck.js";
import { Hand } from "./Hand.js";


describe('A hand of cards', () => {

    const deck = new Deck([
        ORDER_4_LEFT_CARD, ORDER_4_CENTER_CARD, ORDER_4_RIGHT_CARD,
        ORDER_3_LEFT_CARD, ORDER_3_CENTER_CARD, ORDER_3_RIGHT_CARD,
        ORDER_2_LEFT_CARD, ORDER_2_CENTER_CARD, ORDER_2_RIGHT_CARD,
    ]);


    test('enumerating card in order', () => {
        const hand = new Hand([ORDER_4_RIGHT_CARD, ORDER_4_LEFT_CARD, ORDER_4_CENTER_CARD]);

        expect([...hand]).toEqual([ORDER_4_LEFT_CARD, ORDER_4_CENTER_CARD, ORDER_4_RIGHT_CARD,])
    });

    test('playing a card', () => {
        const hand = new Hand([ORDER_4_LEFT_CARD, ORDER_4_CENTER_CARD, ORDER_4_CENTER_CARD]);

        hand.play(ORDER_4_CENTER_CARD);

        expect([...hand]).toEqual([ORDER_4_LEFT_CARD, ORDER_4_CENTER_CARD,])
    });

    test('adding a card', () => {
        const hand = new Hand([ORDER_4_LEFT_CARD, ORDER_4_CENTER_CARD]);

        hand.add(ORDER_3_LEFT_CARD);

        expect([...hand]).toEqual([ORDER_4_LEFT_CARD, ORDER_3_LEFT_CARD, ORDER_4_CENTER_CARD])
    });
});
