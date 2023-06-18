import * as t from "../../lib/test_lib.js";
import {hexOf} from "../../lib/hexlib.js";
import * as units from "../units.js";
import Game from '../game.js'
import {NullScenario} from "../scenarios.js";
import {Side} from "../side.js";
import {MoveCommand} from "../commands/moveCommand.js";
import {EndPhaseCommand} from "../commands/endPhaseCommand.js";


t.test('generate moves for one unit', function () {
    let game = new Game(new NullScenario());

    t.assertEquals(Side.ROMAN, game.currentSide);
    game.placeUnit(hexOf(1, 1), new units.RomanHeavyInfantry());
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
    t.assertEqualsInAnyOrder(expected, moves);
});

/*
     1,4   2,4    3,4   4,4
        1,5   2,5    3,5   4,5
     0,6   1,6    2,6   3,6
*/

t.test('generate commands for two units, avoiding collisions', function () {
    let g = new Game(new NullScenario());
    g.placeUnit(hexOf(2, 5), new units.RomanHeavyInfantry());
    g.placeUnit(hexOf(3, 5), new units.RomanHeavyInfantry());

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
    t.assertEqualsInAnyOrder(expected, commands);
});
