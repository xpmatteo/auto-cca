import { assertEquals, assertDeepEquals } from "../lib/test_lib.js";
import { Die, Dice, RESULT_HEAVY, RESULT_LEADER, RESULT_LIGHT } from "./dice.js";

test("roll one dice", function () {
    const random = () => { return 0; };
    let die = new Die(random);

    die.roll();

    assertEquals(RESULT_LIGHT, die.value);
});

test("roll three dice", function () {
    let index = 0;
    const values = [0, 0.4, 0.9999999999999999];
    const random = () => { return values[index++]; };
    let dice = new Dice(random);

    let results = dice.roll(3);

    assertDeepEquals([RESULT_HEAVY, RESULT_LIGHT, RESULT_LEADER], results);
});
