
import { assertEquals, assertTrue, assertFalse, assertDeepEquals } from '../lib/test_lib.js';
import { Side } from './side.js';
import * as units from './units.js';
import * as dice from './dice.js';
import makeGame from "./game.js";
import { NullScenario } from "./scenarios.js";
import { hexOf } from "../lib/hexlib.js";


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

test('Auxilia does range combat if it moves 1 hexes', function () {
    const game = makeGame(new NullScenario());
    const unit = new units.RomanAuxiliaInfantry();
    game.placeUnit(hexOf(0, 0), unit);
    game.placeUnit(hexOf(2, 0), new units.CarthaginianHeavyInfantry());
    game.addMovementTrail(hexOf(0, 0), hexOf(0, 1));

    assertDeepEquals([hexOf(2, 0)], unit.validRangedCombatTargets(hexOf(0, 0), game));
});

test('Auxilia does not range combat if it moves 2 hexes', function () {
    const game = makeGame(new NullScenario());
    const unit = new units.RomanAuxiliaInfantry();
    game.placeUnit(hexOf(0, 0), unit);
    game.placeUnit(hexOf(2, 0), new units.CarthaginianHeavyInfantry());
    game.addMovementTrail(hexOf(0, 0), hexOf(0, 2));

    assertDeepEquals([], unit.validRangedCombatTargets(hexOf(0, 0), game));
});

test('Auxilia kills on a sword result', function () {

});

