
import { randomShuffleArray } from "../lib/random.js";
import {
    Card, DARKEN_THE_SKY_CARD, MOVE_FIRE_MOVE_CARD,
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
    ORDER_MEDIUM_TROOPS_CARD, ORDER_MOUNTED_CARD, OUT_FLANKED_CARD
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

    /**
     * @param {Card[]} cards
     * @param {Card[]} discards
     */
    constructor(cards, discards = []) {
        this.#talon = cards;
        this.#discards = discards;
    }

    /** @returns {Card[]} */
    talon() {
        return this.#talon.slice();
    }

    /** @returns {Card[]} */
    discards() {
        return this.#discards.slice();
    }

    /** @returns {number} */
    get talonSize() {
        return this.#talon.length;
    }

    /** @returns {number} */
    get discardsSize() {
        return this.#discards.length;
    }

    /** @returns {void} */
    shuffle() {
        this.#talon = randomShuffleArray(this.#talon.concat(this.#discards));
        this.#discards = [];
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

    /**
     * @param {Card} card
     * @returns {void}
     */
    discard(card) {
        this.#discards.push(card);
    }

    /** @returns {Deck} */
    clone() {
        return new Deck(this.#talon.slice(), this.#discards.slice());
    }

    toString() {
        return `Deck(${this.#talon}, ${this.#discards})`;
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
    [2, OUT_FLANKED_CARD],

    [4, ORDER_LIGHT_TROOPS_CARD],
    [3, ORDER_MEDIUM_TROOPS_CARD],
    [2, ORDER_HEAVY_TROOPS_CARD],
    [1, ORDER_MOUNTED_CARD],

    [1, DARKEN_THE_SKY_CARD],
    [2, MOVE_FIRE_MOVE_CARD],
];

export const THE_DECK = new Deck(deckSpecToCards(DECK_SPEC));

