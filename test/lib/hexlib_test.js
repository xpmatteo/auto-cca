// noinspection JSFileReferences
import { hex_to_pixel, hexOf, Layout, LAYOUT_POINTY, Point } from 'xlib/hexlib.js';

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
