import { fixedRandom, resetFixedRandom } from "../lib/random.js";
import { ORDER_4_RIGHT_CARD, ORDER_HEAVY_TROOPS_CARD } from "./cards.js";
import { Deck, THE_DECK } from "./deck.js";

describe('The deck!', () => {

    const originalRandom = Math.random;
    beforeEach(() => {
        resetFixedRandom();
        Math.random = fixedRandom;
    });

    afterEach(() => {
        Math.random = originalRandom;
    });

    test('deck construction', () => {
        const deckSpec = [[2, ORDER_4_RIGHT_CARD], [1, ORDER_HEAVY_TROOPS_CARD]];

        const deck = new Deck(deckSpec);

        expect(deck.toArray()).toEqual([
            ORDER_4_RIGHT_CARD,
            ORDER_4_RIGHT_CARD,
            ORDER_HEAVY_TROOPS_CARD,
        ]);
    });

    test('deck cards', () => {
        expect(THE_DECK.toArray().toString()).toMatchSnapshot();
        expect(THE_DECK.size).toBe(34);
    });

    test('it can be shuffled', () => {

    });
});
