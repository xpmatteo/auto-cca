import * as t from '../../lib/test_lib.js';
import makeGame from '../game.js';
import { NullScenario } from '../scenarios.js';
import { hexOf } from '../../lib/hexlib.js';
import * as units from '../units.js';
import { BattlePhase } from "./BattlePhase.js";
import { EndPhaseCommand } from "../commands/end_phase_command.js";
import { CloseCombatCommand } from "../commands/close_combat_command.js";
import { RangedCombatCommand } from "../commands/ranged_combat_command.js";


test('generate no close combat commands for out of range', function () {
    const game = makeGame(new NullScenario());
    const phase = new BattlePhase(game);
    game.placeUnit(hexOf(0, 0), new units.RomanHeavyInfantry());
    game.placeUnit(hexOf(2, 1), new units.CarthaginianHeavyInfantry());
    game.orderUnit(hexOf(0, 0));

    let commands = phase.validCommands(game);

    let expected = [
        new EndPhaseCommand(),
    ];
    t.assertEqualsInAnyOrder(expected, commands);
});


test('generate close combat commands for one unit and one target', function () {
    const game = makeGame(new NullScenario());
    const phase = new BattlePhase(game);
    game.placeUnit(hexOf(1, 1), new units.RomanHeavyInfantry());
    game.placeUnit(hexOf(2, 1), new units.CarthaginianHeavyInfantry());
    game.orderUnit(hexOf(1, 1));

    let commands = phase.validCommands(game);

    let expected = [
        new CloseCombatCommand(hexOf(2, 1), hexOf(1, 1)),
        new EndPhaseCommand(),
    ];
    t.assertEqualsInAnyOrder(expected, commands);
});

test('generate close combat commands for one unit and two targets', function () {
    const game = makeGame(new NullScenario());
    const phase = new BattlePhase(game);
    game.placeUnit(hexOf(1, 1), new units.RomanHeavyInfantry());
    game.placeUnit(hexOf(2, 1), new units.CarthaginianHeavyInfantry());
    game.placeUnit(hexOf(1, 2), new units.CarthaginianHeavyInfantry());
    game.orderUnit(hexOf(1, 1));

    let commands = phase.validCommands(game);

    let expected = [
        new CloseCombatCommand(hexOf(2, 1), hexOf(1, 1)),
        new CloseCombatCommand(hexOf(1, 2), hexOf(1, 1)),
        new EndPhaseCommand(),
    ];
    t.assertEqualsInAnyOrder(expected, commands);
});

test('generate ranged combat commands for one unit and two targets', function () {
    const game = makeGame(new NullScenario());
    const phase = new BattlePhase(game);
    game.placeUnit(hexOf(0, 4), new units.RomanLightInfantry());
    game.placeUnit(hexOf(1, 2), new units.CarthaginianHeavyInfantry());
    game.placeUnit(hexOf(2, 2), new units.CarthaginianHeavyInfantry());
    game.orderUnit(hexOf(0, 4));

    let commands = phase.validCommands(game);

    let expected = [
        new RangedCombatCommand(hexOf(2, 2), hexOf(0, 4)),
        new RangedCombatCommand(hexOf(1, 2), hexOf(0, 4)),
        new EndPhaseCommand(),
    ];
    t.assertEqualsInAnyOrder(expected, commands);
});

test('no ranged combat if enemy adjacent', function () {
    const game = makeGame(new NullScenario());
    const phase = new BattlePhase(game);
    game.placeUnit(hexOf(0, 4), new units.RomanLightInfantry());
    game.placeUnit(hexOf(1, 4), new units.CarthaginianHeavyInfantry());
    game.placeUnit(hexOf(2, 2), new units.CarthaginianHeavyInfantry());
    game.orderUnit(hexOf(0, 4));

    let commands = phase.validCommands(game);

    let expected = [
        new CloseCombatCommand(hexOf(1, 4), hexOf(0, 4)),
        new EndPhaseCommand(),
    ];
    t.assertEqualsInAnyOrder(expected, commands);
});

test("ranged combat not available to heavies", () => {
    const game = makeGame(new NullScenario());
    const phase = new BattlePhase(game);
    game.placeUnit(hexOf(0, 4), new units.RomanHeavyInfantry());
    game.placeUnit(hexOf(1, 2), new units.CarthaginianHeavyInfantry());
    game.orderUnit(hexOf(0, 4));

    let commands = phase.validCommands(game);

    let expected = [
        new EndPhaseCommand(),
    ];
    t.assertEqualsInAnyOrder(expected, commands);
});


