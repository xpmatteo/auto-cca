import { Side } from './side.js';
import * as units from './units.js';
import * as dice from './dice.js';
import makeGame from "./game.js";
import { NullScenario } from "./scenarios.js";
import { hexOf } from "../lib/hexlib.js";


test('units', function () {
    let unit0 = new units.RomanHeavyInfantry();

    expect(unit0.imageName).toEqual('rom_inf_hv.png');
    expect(unit0.side).toEqual(Side.ROMAN);

    let damage = unit0.takeDamage([dice.RESULT_HEAVY, dice.RESULT_MEDIUM, dice.RESULT_MEDIUM, dice.RESULT_LIGHT, dice.RESULT_SWORDS]);
    expect(damage).toEqual(2);
});


test('carthaginian medium infantry', function () {
    let unit0 = new units.CarthaginianMediumInfantry();

    expect(unit0.initialStrength).toEqual(4);
    expect(unit0.diceCount).toEqual(4);
    expect(unit0.imageName).toEqual('car_inf_md.png');
    expect(unit0.side).toEqual(Side.CARTHAGINIAN);
});

test('Auxilia does range combat if it moves 1 hexes', function () {
    const game = makeGame(new NullScenario());
    const unit = new units.RomanAuxiliaInfantry();
    game.placeUnit(hexOf(0, 0), unit);
    game.placeUnit(hexOf(2, 0), new units.CarthaginianHeavyInfantry());
    game.addMovementTrail(hexOf(0, 0), hexOf(0, 1));

    expect(unit.validRangedCombatTargets(hexOf(0, 0), game)).toEqual([hexOf(2, 0)]);
});

test('Auxilia does not range combat if it moves 2 hexes', function () {
    const game = makeGame(new NullScenario());
    const unit = new units.RomanAuxiliaInfantry();
    game.placeUnit(hexOf(0, 0), unit);
    game.placeUnit(hexOf(2, 0), new units.CarthaginianHeavyInfantry());
    game.addMovementTrail(hexOf(0, 0), hexOf(0, 2));

    expect(unit.validRangedCombatTargets(hexOf(0, 0), game)).toEqual([]);
});

test('Auxilia kills on a sword result', function () {

});

