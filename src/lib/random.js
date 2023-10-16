
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
