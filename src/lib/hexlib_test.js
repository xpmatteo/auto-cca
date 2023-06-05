
import { assertEquals, assertDeepEquals, assertTrue, assertFalse, test, assertEqualsInAnyOrder } from '../test_lib.js';
import { hexOf } from './hexlib.js';

test('hex to string', function () {
    let hex = hexOf(1, 2);
    assertEquals('[1,2]', hex.toString());
});

test('hex distance', function () {
    assertEquals(0, hexOf(0, 0).distance(hexOf(0, 0)));
    assertEquals(1, hexOf(0, 0).distance(hexOf(0, 1)));
    assertEquals(5, hexOf(1, 0).distance(hexOf(4, 2)));
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
    assertEqualsInAnyOrder(expected, actual)
});

test('hex static cosntructor', function () {
    let a = hexOf(1, 2);
    let b = hexOf(1, 2);
    let c = hexOf(2, 1);
    assertEquals(1, a.q);
    assertEquals(a, b, "should be the same hex");
    assertTrue(a !== c, "should be different hexes");
})