
export class DiceResult {
    constructor(name, value) {
        this.name = name;
        this.value = value;
    }

    toString() {
        return this.name;
    }
}

export const RESULT_HEAVY  = new DiceResult('heavy', 0);
export const RESULT_MEDIUM = new DiceResult('medium', 1);
export const RESULT_LIGHT  = new DiceResult('light', 2);
export const RESULT_SWORDS = new DiceResult('swords', 3);
export const RESULT_LEADER = new DiceResult('leader', 4);
export const RESULT_FLAG   = new DiceResult('flag', 5);

const values = [
    RESULT_LIGHT,
    RESULT_MEDIUM,
    RESULT_HEAVY,
    RESULT_FLAG,
    RESULT_SWORDS,
    RESULT_LEADER
];

export class Die {
    #value;
    #random;

    constructor(random = Math.random) {
        this.#random = random;
    }

    roll() {
        this.#value = values[Math.floor(this.#random() * 6)];
    }

    get value() {
        return this.#value;
    }
}

export class Dice {
    #random;

    constructor(random = Math.random) {
        this.#random = random;
    }

    roll(count) {
        let results = [];
        let die = new Die(this.#random);
        for (let i = 0; i < count; i++) {
            die.roll();
            results.push(die.value);
        }
        results.sort((a, b) => a.value - b.value);
        return results;
    }
}

/**
 * @param {DiceResult[]} fixedResults
 * @returns {{roll: (function(number): DiceResult[])}}
 */
export function diceReturningAlways(fixedResults) {
    return {
        roll: function (count) {
            return fixedResults.slice(0, count);
        }
    }
}

export function diceReturning(listOfResults) {
    return {
        roll: function (count) {
            if (listOfResults.length < count) {
                throw new Error(`Not enough results in the list of results: ${listOfResults}`);
            }
            let result = listOfResults.slice(0, count);
            listOfResults = listOfResults.slice(count);
            return result;
        }
    }
}
