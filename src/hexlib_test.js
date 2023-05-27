
import { assertEquals, assertTrue, assertFalse, test } from './test_lib.js';
import { Hex } from './hexlib.js';

test('hex to string', function () {
    let hex = new Hex(1, 2);
    assertEquals('[1,2]', hex.toString());
});


