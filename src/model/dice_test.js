import { Dice, Die, RESULT_HEAVY, RESULT_LEADER, RESULT_LIGHT } from "./dice.js";

test("roll one dice", function () {
    const random = () => { return 0; };
    let die = new Die(random);

    die.roll();

    expect(die.value).toEqual(RESULT_LIGHT);
});

test("roll three dice", function () {
    let index = 0;
    const values = [0, 0.4, 0.9999999999999999];
    const random = () => { return values[index++]; };
    let dice = new Dice(random);

    let results = dice.roll(3);

    expect(results).toEqual([RESULT_HEAVY, RESULT_LIGHT, RESULT_LEADER]);
});
