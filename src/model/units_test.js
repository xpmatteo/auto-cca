
import { assertEquals, assertTrue, assertFalse, test, xtest } from '../lib/test_lib.js';
import { Side } from './side.js';
import * as units from './units.js';
import * as dice from './dice.js';


test('units', function () {
    let unit0 = new units.RomanHeavyInfantry();

    assertEquals('rom_inf_hv.png', unit0.imageName);
    assertEquals(Side.ROMAN, unit0.side);

    let damage = unit0.takeDamage([dice.RESULT_HEAVY, dice.RESULT_MEDIUM, dice.RESULT_MEDIUM, dice.RESULT_LIGHT, dice.RESULT_SWORDS]);
    assertEquals(2, damage);
});


test('carthaginian medium infantry', function () {
    let unit0 = new units.CarthaginianMediumInfantry();

    assertEquals(4, unit0.initialStrength);
    assertEquals(4, unit0.diceCount);
    assertEquals('car_inf_md.png', unit0.imageName);
    assertEquals(Side.CARTHAGINIAN, unit0.side);
});
