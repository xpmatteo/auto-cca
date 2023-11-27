
import { randomShuffleArray } from "../lib/random.js";
import {
    Card, MOVE_FIRE_MOVE_CARD,
    ORDER_2_CENTER_CARD,
    ORDER_2_LEFT_CARD,
    ORDER_2_RIGHT_CARD,
    ORDER_3_CENTER_CARD,
    ORDER_3_LEFT_CARD,
    ORDER_3_RIGHT_CARD,
    ORDER_4_CENTER_CARD,
    ORDER_4_LEFT_CARD,
    ORDER_4_RIGHT_CARD, ORDER_HEAVY_TROOPS_CARD,
    ORDER_LIGHT_TROOPS_CARD,
    ORDER_MEDIUM_TROOPS_CARD
} from './cards.js';

function repeat(number, item) {
    return Array(number).fill(item);
}

export function deckSpecToCards(deckSpec) {
    const result = [];
    for (const [number, card] of deckSpec) {
        result.push(...repeat(number, card));
    }
    return result;
}

export class Deck {
    /** @type {Card[]} */
    #talon;
    /** @type {Card[]} */
    #discards = [];

    constructor(cards) {
        this.#talon = cards;
    }

    /** @returns {Card[]} */
    toArray() {
        return this.#talon.slice();
    }

    /** @returns {number} */
    get talonSize() {
        return this.#talon.length;
    }

    /** @returns {number} */
    get discardsSize() {
        return this.#discards.length;
    }

    /** @returns {Deck} */
    shuffle() {
        return new Deck(randomShuffleArray(this.#talon.slice()));
    }

    /**
     * @param {number} number
     * @returns {Card[]}
     */
    deal(number) {
        const cards = this.#talon.slice(0, number);
        this.#talon = this.#talon.slice(number);
        return cards;
    }
}

/** @type {[number,Card][]} */
const DECK_SPEC = [
    [3, ORDER_2_LEFT_CARD],
    [4, ORDER_2_CENTER_CARD],
    [3, ORDER_2_RIGHT_CARD],
    [3, ORDER_3_LEFT_CARD],
    [4, ORDER_3_CENTER_CARD],
    [3, ORDER_3_RIGHT_CARD],
    [1, ORDER_4_LEFT_CARD],
    [1, ORDER_4_CENTER_CARD],
    [1, ORDER_4_RIGHT_CARD],
    [4, ORDER_LIGHT_TROOPS_CARD],
    [3, ORDER_MEDIUM_TROOPS_CARD],
    [2, ORDER_HEAVY_TROOPS_CARD],
    [2, MOVE_FIRE_MOVE_CARD],
];

export const THE_DECK = new Deck(deckSpecToCards(DECK_SPEC));

