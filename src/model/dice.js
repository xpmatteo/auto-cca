
class DiceResult {
    constructor(name) {
        this.name = name;
    }

    toString() {
        return this.name;
    }
}

export const RESULT_LIGHT = new DiceResult('light');
export const RESULT_MEDIUM = new DiceResult('medium');
export const RESULT_HEAVY = new DiceResult('heavy');
export const RESULT_FLAG = new DiceResult('flag');
export const RESULT_SWORDS = new DiceResult('swords');
export const RESULT_LEADER = new DiceResult('leader');

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
        return results;
    }
}