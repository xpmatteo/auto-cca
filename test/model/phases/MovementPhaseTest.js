import { hexOf } from "xlib/hexlib.js";
import * as units from "model/units.js";
import Game from 'model/game.js'
import { NullScenario } from "model/scenarios.js";
import { Side } from "model/side.js";
import { MoveCommand } from "model/commands/move_command.js";
import { EndPhaseCommand } from "model/commands/end_phase_command.js";
import { MovementPhase } from "model/phases/MovementPhase.js";
import { OrderLightTroopsCard } from "model/cards.js";


function makeGameInMovementPhase() {
    let game = new Game(new NullScenario());
    game.phases = [new MovementPhase()];
    game.currentCard = new OrderLightTroopsCard();
    return game;
}

function placeOrderedUnit(game, hex, unit) {
    game.placeUnit(hex, unit);
    game.orderUnit(hex);
}

t.test('generate moves for one unit', function () {
    let game = makeGameInMovementPhase();
    expect(game.currentSide).toEqual(Side.ROMAN);
    placeOrderedUnit(game, hexOf(1, 1), new units.RomanHeavyInfantry());
    game.placeUnit(hexOf(3, 3), new units.CarthaginianHeavyInfantry());


    let moves = game.validCommands();

    let expected = [
        new MoveCommand(hexOf(1, 0), hexOf(1, 1)),
        new MoveCommand(hexOf(2, 0), hexOf(1, 1)),
        new MoveCommand(hexOf(0, 1), hexOf(1, 1)),
        new MoveCommand(hexOf(2, 1), hexOf(1, 1)),
        new MoveCommand(hexOf(0, 2), hexOf(1, 1)),
        new MoveCommand(hexOf(1, 2), hexOf(1, 1)),
        new EndPhaseCommand(),
    ];
    expect(moves.length).toEqual(expected.length);
    expect(new Set(moves)).toEqual(new Set(expected));
});

t.test('only ordered units can move', function () {
    let game = makeGameInMovementPhase();
    expect(game.currentSide).toEqual(Side.ROMAN);
    game.placeUnit(hexOf(1, 1), new units.RomanHeavyInfantry());
    game.placeUnit(hexOf(3, 3), new units.CarthaginianHeavyInfantry());

    let moves = game.validCommands();

    let expected = [
        new EndPhaseCommand(),
    ];
    expect(moves.length).toEqual(expected.length);
    expect(new Set(moves)).toEqual(new Set(expected));
});

/*
     1,4   2,4    3,4   4,4
        1,5   2,5    3,5   4,5
     0,6   1,6    2,6   3,6
*/

t.test('generate commands for two units, avoiding collisions', function () {
    let g = makeGameInMovementPhase();
    g.placeUnit(hexOf(2, 5), new units.RomanHeavyInfantry());
    g.orderUnit(hexOf(2, 5));
    g.placeUnit(hexOf(3, 5), new units.RomanHeavyInfantry());
    g.orderUnit(hexOf(3, 5));

    let commands = g.validCommands();

    let expected = [
        new MoveCommand(hexOf(3, 4), hexOf(2, 5)),
        new MoveCommand(hexOf(2, 4), hexOf(2, 5)),
        new MoveCommand(hexOf(1, 5), hexOf(2, 5)),
        new MoveCommand(hexOf(1, 6), hexOf(2, 5)),
        new MoveCommand(hexOf(2, 6), hexOf(2, 5)),

        new MoveCommand(hexOf(3, 4), hexOf(3, 5)),
        new MoveCommand(hexOf(4, 4), hexOf(3, 5)),
        new MoveCommand(hexOf(4, 5), hexOf(3, 5)),
        new MoveCommand(hexOf(2, 6), hexOf(3, 5)),
        new MoveCommand(hexOf(3, 6), hexOf(3, 5)),

        new EndPhaseCommand(),
    ];
    expect(commands.length).toEqual(expected.length);
    expect(new Set(commands)).toEqual(new Set(expected));
});

t.test('generate commands for a light foot unit, can pass through friendlies', function () {
    let g = makeGameInMovementPhase();
    g.placeUnit(hexOf(0, 0), new units.RomanLightInfantry());
    g.orderUnit(hexOf(0, 0));
    // these two units block the way, except that the card allows light units to pass through
    g.placeUnit(hexOf(1, 0), new units.RomanHeavyInfantry());
    g.placeUnit(hexOf(0, 1), new units.RomanHeavyInfantry());

    let commands = g.validCommands();

    let expected = [
        new MoveCommand(hexOf(2, 0), hexOf(0, 0)),
        new MoveCommand(hexOf(1, 1), hexOf(0, 0)),
        new MoveCommand(hexOf(0, 2), hexOf(0, 0)),
        new MoveCommand(hexOf(-1, 2), hexOf(0, 0)),

        new EndPhaseCommand(),
    ];
    expect(commands.length).toEqual(expected.length);
    expect(new Set(commands)).toEqual(new Set(expected));
});


t.test('generate moves for unit of range 2', function () {
    let game = makeGameInMovementPhase();
    game.placeUnit(hexOf(1, 1), new units.RomanLightInfantry());
    game.orderUnit(hexOf(1, 1));

    let moves = game.validCommands();

    let expected = [
        new MoveCommand(hexOf(1, 0), hexOf(1, 1)),
        new MoveCommand(hexOf(2, 0), hexOf(1, 1)),
        new MoveCommand(hexOf(0, 1), hexOf(1, 1)),
        new MoveCommand(hexOf(2, 1), hexOf(1, 1)),
        new MoveCommand(hexOf(0, 2), hexOf(1, 1)),
        new MoveCommand(hexOf(1, 2), hexOf(1, 1)),

        new MoveCommand(hexOf(0, 0), hexOf(1, 1)),
        new MoveCommand(hexOf(3, 0), hexOf(1, 1)),
        new MoveCommand(hexOf(3, 1), hexOf(1, 1)),
        new MoveCommand(hexOf(2, 2), hexOf(1, 1)),
        new MoveCommand(hexOf(1, 3), hexOf(1, 1)),
        new MoveCommand(hexOf(0, 3), hexOf(1, 1)),
        new MoveCommand(hexOf(-1, 3), hexOf(1, 1)),
        new MoveCommand(hexOf(-1, 2), hexOf(1, 1)),
        new EndPhaseCommand(),
    ];
    expect(moves.length).toEqual(expected.length);
    expect(new Set(moves)).toEqual(new Set(expected));
});