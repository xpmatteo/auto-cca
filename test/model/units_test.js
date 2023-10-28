import { Side } from 'model/side.js';
import {
    CarthaginianHeavyCavalry, CarthaginianHeavyChariot,
    CarthaginianHeavyInfantry,
    CarthaginianLightCavalry,
    CarthaginianLightInfantry,
    CarthaginianMediumCavalry,
    CarthaginianMediumInfantry, RomanAuxiliaInfantry,
    RomanHeavyCavalry,
    RomanHeavyInfantry, RomanLightCavalry,
    RomanLightInfantry,
    RomanMediumCavalry,
    RomanMediumInfantry
} from "model/units.js";
import * as units from 'model/units.js';
import * as dice from 'model/dice.js';
import makeGame from "model/game.js";
import { NullScenario } from "model/scenarios.js";
import { hexOf } from "xlib/hexlib.js";


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

    expect(unit.validRangedCombatTargets(hexOf(0, 0), game).toString()).toEqual([hexOf(2, 0)].toString());
});

test('Auxilia does not range combat if it moves 2 hexes', function () {
    const game = makeGame(new NullScenario());
    const unit = new units.RomanAuxiliaInfantry();
    game.placeUnit(hexOf(0, 0), unit);
    game.placeUnit(hexOf(2, 0), new units.CarthaginianHeavyInfantry());
    game.addMovementTrail(hexOf(0, 0), hexOf(0, 2));

    expect(unit.validRangedCombatTargets(hexOf(0, 0), game)).toEqual([]);
});

test('no range combat if it enemy adjacent', function () {
    const game = makeGame(new NullScenario());
    const unit = new units.RomanAuxiliaInfantry();
    game.placeUnit(hexOf(0, 0), unit);
    game.placeUnit(hexOf(2, 0), new units.CarthaginianHeavyInfantry());
    game.placeUnit(hexOf(0, 1), new units.CarthaginianHeavyInfantry());

    expect(unit.validRangedCombatTargets(hexOf(0, 0), game)).toEqual([]);
});

describe('ranged combat with obstacles', () => {
    const game = makeGame(new NullScenario());
    const lightInfantry = new units.RomanLightInfantry();
    const lightBows = new units.RomanLightBowsInfantry();
    const target = new units.CarthaginianHeavyInfantry();
    const obstacle = new units.RomanHeavyInfantry();

    test('one obstacle', function () {
        game.placeUnit(hexOf(0, 0), lightInfantry);
        game.placeUnit(hexOf(1, 0), obstacle);
        game.placeUnit(hexOf(2, 0), target);

        expect(lightInfantry.validRangedCombatTargets(hexOf(0, 0), game).length).toBe(0);
    });
});

describe('evasion', () => {
    [
        { defendingUnit: new RomanLightInfantry(), attackingUnit: new CarthaginianHeavyInfantry(), expected: true },
        { defendingUnit: new RomanAuxiliaInfantry(), attackingUnit: new CarthaginianHeavyInfantry(), expected: false },
        { defendingUnit: new RomanLightInfantry(), attackingUnit: new CarthaginianLightInfantry(), expected: true },
        { defendingUnit: new RomanMediumInfantry(), attackingUnit: new CarthaginianHeavyInfantry(), expected: false },
        { defendingUnit: new RomanHeavyInfantry(), attackingUnit: new CarthaginianHeavyInfantry(), expected: false },

        { defendingUnit: new RomanMediumCavalry(), attackingUnit: new CarthaginianLightInfantry(), expected: true },
        { defendingUnit: new RomanMediumCavalry(), attackingUnit: new CarthaginianMediumInfantry(), expected: true },
        { defendingUnit: new RomanMediumCavalry(), attackingUnit: new CarthaginianHeavyInfantry(), expected: true },
        { defendingUnit: new RomanMediumCavalry(), attackingUnit: new CarthaginianLightCavalry(), expected: false },
        { defendingUnit: new RomanMediumCavalry(), attackingUnit: new CarthaginianMediumCavalry(), expected: false },
        { defendingUnit: new RomanMediumCavalry(), attackingUnit: new CarthaginianHeavyCavalry(), expected: true },

        { defendingUnit: new RomanHeavyCavalry(), attackingUnit: new CarthaginianLightInfantry(), expected: true },
        { defendingUnit: new RomanHeavyCavalry(), attackingUnit: new CarthaginianMediumInfantry(), expected: true },
        { defendingUnit: new RomanHeavyCavalry(), attackingUnit: new CarthaginianHeavyInfantry(), expected: true },
        { defendingUnit: new RomanHeavyCavalry(), attackingUnit: new CarthaginianLightCavalry(), expected: false },
        { defendingUnit: new RomanHeavyCavalry(), attackingUnit: new CarthaginianMediumCavalry(), expected: false },
        { defendingUnit: new RomanHeavyCavalry(), attackingUnit: new CarthaginianHeavyCavalry(), expected: false },

        { defendingUnit: new CarthaginianHeavyChariot(), attackingUnit: new RomanLightInfantry(), expected: true },
        { defendingUnit: new CarthaginianHeavyChariot(), attackingUnit: new RomanMediumInfantry(), expected: true },
        { defendingUnit: new CarthaginianHeavyChariot(), attackingUnit: new RomanHeavyInfantry(), expected: true },
        { defendingUnit: new CarthaginianHeavyChariot(), attackingUnit: new RomanLightCavalry(), expected: false },
        { defendingUnit: new CarthaginianHeavyChariot(), attackingUnit: new RomanMediumCavalry(), expected: false },
        { defendingUnit: new CarthaginianHeavyChariot(), attackingUnit: new RomanHeavyCavalry(), expected: false },

    ].forEach(({defendingUnit,attackingUnit, expected}) => {
        test(`${defendingUnit} can evade ${attackingUnit}: ${expected}`, () => {
            expect(defendingUnit.canEvade(attackingUnit)).toBe(expected);
        });
    });
});
