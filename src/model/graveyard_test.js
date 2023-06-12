"use strict";

import { test, assertDeepEquals } from "../lib/test_lib.js";
import { Graveyard } from "./graveyard.js";
import { Side } from "./side.js";
import * as units from "./units.js";

test("add unit to graveyard", function () {
    const graveyard = new Graveyard();
    const romanUnit = new units.RomanHeavyInfantry();
    const nonRomanUnit = new units.CarthaginianHeavyInfantry();

    graveyard.bury(romanUnit);
    graveyard.bury(nonRomanUnit);

    assertDeepEquals([romanUnit], graveyard.unitsOf(Side.ROMAN));
});