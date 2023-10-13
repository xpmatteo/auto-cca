import { choose } from "xlib/combinatorial.js";


describe('choose n k', function() {
    it('should return 1 when k is 0', function() {
        expect(choose([], 1)).toEqual([]);
        expect(choose([0], 1)).toEqual([[0]]);
        expect(choose([0, 1], 1)).toEqual([[0], [1]]);
        expect(choose([0, 1, 2], 1)).toEqual([[0], [1], [2]]);
        expect(choose([0, 1, 2], 2)).toEqual([[0, 1], [0, 2], [1, 2]]);
        expect(choose([0, 1, 2], 3)).toEqual([[0, 1, 2]]);
    });
});
