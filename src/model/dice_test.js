import { assertEquals, test } from "../lib/test_lib.js";
import { Die, RESULT_LIGHT } from "./dice.js";

test("roll one dice", function () {
    const random = () => { return 0; };
    let die = new Die(random);
    
    die.roll();
    
    assertEquals(RESULT_LIGHT, die.value);    
});
