import { assertDeepEquals, assertEquals, assertEqualsInAnyOrder, test } from "../../lib/test_lib.js";
import Game from "../game.js";
import { NullScenario } from "../scenarios.js";
import { hexOf } from "../../lib/hexlib.js";
import * as units from "../units.js";
import { EndPhaseCommand } from "../commands/endPhaseCommand.js";
import { RESULT_HEAVY } from "../dice.js";
import { OrderUnitCommand } from "../commands/order_unit_command.js";
import { OrderUnitsPhase } from "./order_units_phase.js";
import { InteractiveGame } from "../../interactive_game.js";

function makeGameWithFiveUnits() {
    let game = new Game(new NullScenario());
    game.placeUnit(hexOf(0, 0), new units.CarthaginianHeavyInfantry());
    game.placeUnit(hexOf(1, 1), new units.RomanLightInfantry());
    game.placeUnit(hexOf(1, 2), new units.RomanHeavyInfantry());
    game.placeUnit(hexOf(1, 3), new units.RomanHeavyCavalry());
    game.placeUnit(hexOf(1, 4), new units.RomanHeavyCavalry());
    return game;
}
const phase = new OrderUnitsPhase(2, RESULT_HEAVY);

test("order units", () => {
    let game = makeGameWithFiveUnits();

    let moves = phase.validCommands(game);

    let expected = [
        new OrderUnitCommand(hexOf(1, 2)),
        new OrderUnitCommand(hexOf(1, 3)),
        new OrderUnitCommand(hexOf(1, 4)),
        new EndPhaseCommand(),
    ];
    assertEqualsInAnyOrder(expected, moves);
});

test("cannot order already ordered", () => {
    let game = makeGameWithFiveUnits();
    game.executeCommand(new OrderUnitCommand(hexOf(1, 2)));

    let moves = phase.validCommands(game);

    let expected = [
        new OrderUnitCommand(hexOf(1, 3)),
        new OrderUnitCommand(hexOf(1, 4)),
        new EndPhaseCommand(),
    ];
    assertEqualsInAnyOrder(expected, moves);
});

test("cannot order more than two units", () => {
    let game = makeGameWithFiveUnits();
    game.executeCommand(new OrderUnitCommand(hexOf(1, 2)));
    game.executeCommand(new OrderUnitCommand(hexOf(1, 3)));

    let moves = phase.validCommands(game);

    let expected = [
        new EndPhaseCommand(),
    ];
    assertEqualsInAnyOrder(expected, moves);
});

test("highlighted hexes", () => {
    let game = makeGameWithFiveUnits();

    assertDeepEquals(new Set([hexOf(1,2), hexOf(1,3), hexOf(1,4)]), phase.hilightedHexes(game));
});

test("click to order unit", () => {
    let game = makeGameWithFiveUnits();

    phase.onClick(hexOf(1, 2), game);

    assertEquals(1, game.orderedUnits.length);
});

test("click to unorder unit", () => {
    let game = makeGameWithFiveUnits();

    phase.onClick(hexOf(1, 2), game);
    phase.onClick(hexOf(1, 2), game);

    assertEquals(0, game.orderedUnits.length);
});

test("ignore click on unit that cannot be ordered", () => {
    let game = makeGameWithFiveUnits();

    phase.onClick(hexOf(0, 0), game);

    assertEquals(0, game.orderedUnits.length);
});