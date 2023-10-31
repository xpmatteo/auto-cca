import { randomShuffleArray } from "./random.js";

describe('randomShuffleArray', () => {
    test('no elements', () => {
        const array = [];

        randomShuffleArray(array);

        expect(array).toEqual([]);
    });

    test('one element', () => {
        const array = [1];

        randomShuffleArray(array);

        expect(array).toEqual([1]);
    });

    test('five elements', () => {
        const array = [1, 2, 3, 4, 5];
        const originalArray = array.slice();

        randomShuffleArray(array);

        // console.log(array);
        expect(new Set(array)).toEqual(new Set(originalArray));
    });
});
