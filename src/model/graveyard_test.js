"use strict";

import { test, assertDeepEquals } from "../lib/test_lib.js";
import { Graveyard } from "./graveyard.js";
import { Side } from "./side.js";

test("add unit to graveyard", function () {
    const graveyard = new Graveyard();
    const romanUnit = { side: Side.ROMAN };
    const nonRomanUnit = { side: Side.CARTHAGINIAN };

    graveyard.bury(romanUnit);
    graveyard.bury(nonRomanUnit);

    assertDeepEquals([romanUnit], graveyard.unitsOf(Side.ROMAN));
});