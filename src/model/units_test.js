
import { assertEquals, assertTrue, assertFalse, test, xtest } from '../lib/test_lib.js';
import { Side } from './side.js';
import { RomanHeavyInfantry, CarthaginianHeavyInfantry } from './units.js';


test('units', function () {
    let unit0 = new RomanHeavyInfantry();

    assertEquals('rom_inf_hv.png', unit0.imageName);
    assertEquals(Side.ROMAN, unit0.side);
});


xtest('unit attack', function () {
    let attacker = new RomanHeavyInfantry();
    let defender = new CarthaginianHeavyInfantry();
    let dice = { roll: function () { return 1; } };

    attacker.attack(defender, dice);


});