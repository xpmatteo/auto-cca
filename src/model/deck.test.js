import { fixedRandom, resetFixedRandom } from "../lib/random.js";
import { ORDER_4_RIGHT_CARD, ORDER_HEAVY_TROOPS_CARD } from "./cards.js";
import { Deck, deckSpecToCards, THE_DECK } from "./deck.js";

describe('The deck!', () => {
    const originalRandom = Math.random;
    beforeEach(() => {
        resetFixedRandom();
        Math.random = fixedRandom;
    });

    afterEach(() => {
        Math.random = originalRandom;
    });

    const deckSpec = [[2, ORDER_4_RIGHT_CARD], [3, ORDER_HEAVY_TROOPS_CARD]];

    test('deck construction', () => {
        const deck = new Deck(deckSpecToCards(deckSpec));

        expect(deck.toArray()).toEqual([
            ORDER_4_RIGHT_CARD,
            ORDER_4_RIGHT_CARD,
            ORDER_HEAVY_TROOPS_CARD,
            ORDER_HEAVY_TROOPS_CARD,
            ORDER_HEAVY_TROOPS_CARD,
        ]);
    });

    test('full deck cards', () => {
        expect(THE_DECK.talonSize).toBe(34);
        expect(THE_DECK.discardsSize).toBe(0);
        expect(THE_DECK.toArray().toString()).toMatchSnapshot();
    });

    test('it can be shuffled', () => {
        const deck = new Deck(deckSpecToCards(deckSpec));

        const shuffled = deck.shuffle();

        expect(shuffled.toArray().map(c => c.name)).toEqual([
            "Order Four Units Right",
            "Order Heavy Troops",
            "Order Four Units Right",
            "Order Heavy Troops",
            "Order Heavy Troops",
        ]);
    });

    test('dealing cards when talon is sufficient', () => {
        const deck = new Deck(deckSpecToCards(deckSpec));

        const [card1, card2, card3] = deck.deal(3);

        expect(deck.talonSize).toBe(2);
        expect(deck.discardsSize).toBe(0);
        expect(card1.name).toBe("Order Four Units Right");
        expect(card2.name).toBe("Order Four Units Right");
        expect(card3.name).toBe("Order Heavy Troops");
        expect(deck.toArray().map(c => c.name)).toEqual([
            "Order Heavy Troops",
            "Order Heavy Troops",
        ]);
    });

});
