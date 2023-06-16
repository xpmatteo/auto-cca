
import { assertEquals, assertTrue, assertFalse, test, xtest } from '../lib/test_lib.js';
import { Side } from './side.js';
import * as units from './units.js';
import * as dice from './dice.js';


test('units', function () {
    let unit0 = new units.RomanHeavyInfantry();

    assertEquals('rom_inf_hv.png', unit0.imageName);
    assertEquals(Side.ROMAN, unit0.side);

    unit0.takeDamage([dice.RESULT_HEAVY, dice.RESULT_MEDIUM, dice.RESULT_MEDIUM, dice.RESULT_LIGHT, dice.RESULT_SWORDS]);
    assertEquals(2, unit0.strength);
});

test('units display strength', function () {
    let unit0 = new units.RomanHeavyInfantry();

    assertEquals('IV', unit0.displayStrength());
});

test('carthaginian medium infantry', function () {
    let unit0 = new units.CarthaginianMediumInfantry();

    assertEquals(4, unit0.strength);
    assertEquals(4, unit0.diceCount);
    assertEquals('car_inf_md.png', unit0.imageName);
    assertEquals(Side.CARTHAGINIAN, unit0.side);

    unit0.takeDamage([dice.RESULT_HEAVY, dice.RESULT_MEDIUM, dice.RESULT_MEDIUM, dice.RESULT_LIGHT, dice.RESULT_SWORDS]);
    assertEquals(1, unit0.strength);
});


test("clone", () => {
    let o = new units.RomanHeavyInfantry();
    o.strength = 2;
    
    let clone = o.clone();
    
    assertEquals(o.toString(), clone.toString());
    assertEquals(o.imageName, clone.imageName);
    assertEquals(o.strength, clone.strength, "strength should be copied");

    clone.strength = 3;
    assertEquals(2, o.strength);
    assertEquals(3, clone.strength);
});
