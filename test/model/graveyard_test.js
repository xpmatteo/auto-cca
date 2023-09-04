"use strict";

import { Graveyard } from "model/graveyard.js";
import { Side } from "model/side.js";
import * as units from "model/units.js";

test("add unit to graveyard", function () {
    const graveyard = new Graveyard();
    const romanUnit = new units.RomanHeavyInfantry();
    const nonRomanUnit = new units.CarthaginianHeavyInfantry();

    graveyard.bury(romanUnit);
    graveyard.bury(nonRomanUnit);

    expect(graveyard.unitsOf(Side.ROMAN)).toEqual([romanUnit]);
});

test('clone', () => {
    const graveyard = new Graveyard();
    const romanUnit = new units.RomanHeavyInfantry();
    graveyard.bury(romanUnit);

    const graveyardClone = graveyard.clone();

    expect(graveyardClone.unitsOf(Side.ROMAN)).toEqual(graveyard.unitsOf(Side.ROMAN));
});
