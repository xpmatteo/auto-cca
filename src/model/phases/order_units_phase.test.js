import { endPhaseCommand } from "../commands/end_phase_command.js";
import { OrderUnitCommand } from "../commands/order_unit_command.js";
import { RESULT_HEAVY } from "../dice.js";
import makeGame from "../game.js";
import { OrderUnitsPhase } from "./order_units_phase.js";
import { NullScenario } from "../scenarios.js";
import * as units from "../units.js";
import { hexOf, Point } from "../../lib/hexlib.js";

const PHASE = new OrderUnitsPhase(2, (unit, game) => unit.weight == RESULT_HEAVY);

function makeGameWithFiveUnits() {
    let game = makeGame(new NullScenario());
    game.placeUnit(hexOf(0, 0), new units.CarthaginianHeavyInfantry());
    game.placeUnit(hexOf(1, 1), new units.RomanLightInfantry());
    game.placeUnit(hexOf(1, 2), new units.RomanHeavyInfantry());
    game.placeUnit(hexOf(1, 3), new units.RomanHeavyCavalry());
    game.placeUnit(hexOf(1, 4), new units.RomanHeavyCavalry());
    game.phases = [PHASE];
    return game;
}

test("order units", () => {
    let game = makeGameWithFiveUnits();

    let moves = PHASE.validCommands(game);

    let expected = [
        new OrderUnitCommand([hexOf(1, 2), hexOf(1, 3)]),
        new OrderUnitCommand([hexOf(1, 2), hexOf(1, 4)]),
        new OrderUnitCommand([hexOf(1, 3), hexOf(1, 4)]),
    ];
    expect(new Set(moves)).toEqual(new Set(expected));
});

test("cannot order already ordered", () => {
    let game = makeGameWithFiveUnits();
    game.executeCommand(new OrderUnitCommand([hexOf(1, 2)]));

    let moves = PHASE.validCommands(game);

    let expected = [
        new OrderUnitCommand([hexOf(1, 3)]),
        new OrderUnitCommand([hexOf(1, 4)]),
    ];
    expect(new Set(moves)).toStrictEqual(new Set(expected));
});

test("cannot order more than two units", () => {
    let game = makeGameWithFiveUnits();
    game.executeCommand(new OrderUnitCommand([hexOf(1, 2)]));
    game.executeCommand(new OrderUnitCommand([hexOf(1, 3)]));

    let commands = PHASE.validCommands(game);

    let expected = [
        endPhaseCommand(),
    ];
    expect(new Set(commands)).toEqual(new Set(expected));
});

describe('hilighted hexes', () => {
    test("when no unit is ordered", () => {
        let game = makeGameWithFiveUnits();

        expect(PHASE.hilightedHexes(game)).toEqual(new Set([hexOf(1, 2), hexOf(1, 3), hexOf(1, 4)]));
    });

    test("when one unit is ordered", () => {
        let game = makeGameWithFiveUnits();
        game.orderUnit(hexOf(1, 2));

        expect(PHASE.hilightedHexes(game)).toEqual(new Set([hexOf(1, 3), hexOf(1, 4)]));
    });

    test("when max number of units is ordered", () => {
        let game = makeGameWithFiveUnits();
        game.orderUnit(hexOf(1, 2));
        game.orderUnit(hexOf(1, 3));

        expect(PHASE.hilightedHexes(game)).toEqual(new Set());
    });

});

const pointWithinMap = new Point(0, 0);

test("click to order unit", () => {
    let game = makeGameWithFiveUnits();

    PHASE.onClick(hexOf(1, 2), game, pointWithinMap);

    expect(game.orderedUnits.length).toEqual(1);
});

test("click to unorder unit", () => {
    let game = makeGameWithFiveUnits();

    PHASE.onClick(hexOf(1, 2), game, pointWithinMap);
    PHASE.onClick(hexOf(1, 2), game, pointWithinMap);

    expect(game.orderedUnits.length).toEqual(0);
});

test("ignore click on unit that cannot be ordered", () => {
    let game = makeGameWithFiveUnits();

    PHASE.onClick(hexOf(0, 0), game, pointWithinMap);

    expect(game.orderedUnits.length).toEqual(0);
});
