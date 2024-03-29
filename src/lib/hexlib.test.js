import { hasLineOfSight, hex_to_pixel, hexOf, Layout, LAYOUT_POINTY, Point } from './hexlib.js';

test('hex to string', function () {
    let hex = hexOf(1, 2);
    expect(hex.toString()).toEqual('[1,2]');
});

test('hex distance', function () {
    expect(hexOf(0, 0).distance(hexOf(0, 0))).toEqual(0);
    expect(hexOf(0, 0).distance(hexOf(0, 1))).toEqual(1);
    expect(hexOf(1, 0).distance(hexOf(4, 2))).toEqual(5);
});

test('hex neighbors', function () {
    let actual = hexOf(6, 1).neighbors();

    let expected = [
        hexOf(5, 1),
        hexOf(5, 2),
        hexOf(6, 0),
        hexOf(6, 2),
        hexOf(7, 0),
        hexOf(7, 1),
    ]
    expect(actual.length).toEqual(expected.length);
    expect(new Set(actual)).toEqual(new Set(expected));
});

test('hex static constructor', function () {
    let a = hexOf(1, 2);
    let b = hexOf(1, 2);
    let c = hexOf(2, 1);
    expect(a.q).toEqual(1);
    expect(b).toEqual(a);
    expect(a !== c).toBe(true);
})

test('layout', function () {
    const test_layout = new Layout(LAYOUT_POINTY, new Point(50, 60), new Point(10, 100));
    expect(test_layout.orientation).toEqual(LAYOUT_POINTY);
    expect(new Point(10, 100)).toEqual(hex_to_pixel(test_layout, hexOf(0, 0, 0)));
});

test('computed coordinate s', function () {
    expect(hexOf(1, -1, 0).s).toEqual(0);
    expect(hexOf(10, 20).s).toEqual(-30);
});

describe('line of sight', () => {
    [
        {from: hexOf(0,0), to: hexOf(0,1), withObstaclesAt: [], expected: true },
        {from: hexOf(0,0), to: hexOf(0,2), withObstaclesAt: [], expected: true },
        {from: hexOf(0,0), to: hexOf(0,3), withObstaclesAt: [], expected: true },
        {from: hexOf(0,0), to: hexOf(1,0), withObstaclesAt: [], expected: true },
        {from: hexOf(0,0), to: hexOf(2,0), withObstaclesAt: [], expected: true },
        {from: hexOf(0,0), to: hexOf(3,0), withObstaclesAt: [], expected: true },
        {from: hexOf(0,0), to: hexOf(1,1), withObstaclesAt: [], expected: true },
        {from: hexOf(0,0), to: hexOf(1,2), withObstaclesAt: [], expected: true },
        {from: hexOf(0,0), to: hexOf(2,1), withObstaclesAt: [], expected: true },
        {from: hexOf(0,0), to: hexOf(-1,2), withObstaclesAt: [], expected: true },

        {from: hexOf(0,0), to: hexOf(0,2), withObstaclesAt: [hexOf(0,1)], expected: false },
        {from: hexOf(0,0), to: hexOf(2,1), withObstaclesAt: [hexOf(1,1)], expected: false },
        {from: hexOf(0,0), to: hexOf(1,2), withObstaclesAt: [hexOf(1,1)], expected: false },
        {from: hexOf(0,0), to: hexOf(0,2), withObstaclesAt: [hexOf(1,1)], expected: true },
        {from: hexOf(0,0), to: hexOf(2,0), withObstaclesAt: [hexOf(1,1)], expected: true },

        // north-south edge cases
        {from: hexOf(3,0), to: hexOf(2,2), withObstaclesAt: [hexOf(3,1)], expected: true },
        {from: hexOf(3,0), to: hexOf(2,2), withObstaclesAt: [hexOf(2,1)], expected: true },
        {from: hexOf(3,0), to: hexOf(2,2), withObstaclesAt: [hexOf(2,1), hexOf(3,1)], expected: false },
        {from: hexOf(2,2), to: hexOf(3,0), withObstaclesAt: [hexOf(3,1)], expected: true },
        {from: hexOf(2,2), to: hexOf(3,0), withObstaclesAt: [hexOf(2,1)], expected: true },
        {from: hexOf(2,2), to: hexOf(3,0), withObstaclesAt: [hexOf(2,1), hexOf(3,1)], expected: false },

        // nw-se edge cases
        {from: hexOf(0,0), to: hexOf(1,1), withObstaclesAt: [hexOf(1,0)], expected: true },
        {from: hexOf(0,0), to: hexOf(1,1), withObstaclesAt: [hexOf(0,1)], expected: true },
        {from: hexOf(0,0), to: hexOf(1,1), withObstaclesAt: [hexOf(1,0), hexOf(0,1)], expected: false },
        {from: hexOf(1,1), to: hexOf(0,0), withObstaclesAt: [hexOf(1,0)], expected: true },
        {from: hexOf(1,1), to: hexOf(0,0), withObstaclesAt: [hexOf(0,1)], expected: true },
        {from: hexOf(1,1), to: hexOf(0,0), withObstaclesAt: [hexOf(1,0), hexOf(0,1)], expected: false },

        // ne-sw edge cases
        {from: hexOf(1,2), to: hexOf(3,1), withObstaclesAt: [hexOf(2,1)], expected: true },
        {from: hexOf(1,2), to: hexOf(3,1), withObstaclesAt: [hexOf(2,2)], expected: true },
        {from: hexOf(1,2), to: hexOf(3,1), withObstaclesAt: [hexOf(2,1), hexOf(2,2)], expected: false },
        {from: hexOf(3,1), to: hexOf(1,2), withObstaclesAt: [hexOf(2,1)], expected: true },
        {from: hexOf(3,1), to: hexOf(1,2), withObstaclesAt: [hexOf(2,2)], expected: true },
        {from: hexOf(3,1), to: hexOf(1,2), withObstaclesAt: [hexOf(2,1), hexOf(2,2)], expected: false },

    ].forEach(({from, to, withObstaclesAt, expected}) => {
        test(`Line of sight from ${from} to ${to} with obstacles at ${withObstaclesAt}: ${expected}`, () => {
            const blocked = hex => withObstaclesAt.includes(hex)  || hex === from || hex === to;
            expect(hasLineOfSight(to, from, blocked)).toBe(expected);
        });
    });

});
