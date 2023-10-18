
export function randomShuffleArray(array) {
    for (let i = 0; i < array.length; i++) {
        const j = Math.floor(Math.random() * (array.length - i)) + i;
        [array[i], array[j]] = [array[j], array[i]];
    }
}

/**
 * @template T
 * @param {T[]} array
 * @returns {T}
 */
export function randomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

const RANDOM_VALUES = [0.1, 0.3, 0.2, 0.7, 0.9, 0.6, 0.4, 0.8];
let nextRandom = 0;
export function fixedRandom() {
    return RANDOM_VALUES[nextRandom++ % 8];
}
