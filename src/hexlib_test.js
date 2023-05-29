
import { assertEquals, assertDeepEquals, assertTrue, assertFalse, test, assertEqualsInAnyOrder } from './test_lib.js';
import { Hex } from './hexlib.js';

test('hex to string', function () {
    let hex = new Hex(1, 2);
    assertEquals('[1,2]', hex.toString());
});

test('hex distance', function () {
    assertEquals(0, new Hex(0, 0).distance(new Hex(0, 0)));
    assertEquals(1, new Hex(0, 0).distance(new Hex(0, 1)));
    assertEquals(5, new Hex(1, 0).distance(new Hex(4, 2)));
});

test('hex neighbors', function () {
    let actual = new Hex(6, 1).neighbors();

    let expected = [
        new Hex(5, 1),
        new Hex(5, 2),
        new Hex(6, 0),
        new Hex(6, 2),
        new Hex(7, 0),
        new Hex(7, 1),        
    ]    
    assertEqualsInAnyOrder(expected, actual)
});