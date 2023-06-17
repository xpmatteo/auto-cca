import * as t from '../../lib/test_lib.js';
import makeGame from '../game.js';
import { NullScenario } from '../scenarios.js';
import { hexOf } from '../../lib/hexlib.js';
import * as units from '../units.js';
import { BattlePhase } from "./BattlePhase.js";
import { EndPhaseCommand, CloseCombatCommand } from '../commands/commands.js';


t.test('generate no close combat commands for out of range', function () {
    const game = makeGame(new NullScenario());
    const phase = new BattlePhase(game);
    game.placeUnit(hexOf(0, 0), new units.RomanHeavyInfantry());
    game.placeUnit(hexOf(2, 1), new units.CarthaginianHeavyInfantry());

    let commands = phase.validCommands(game);

    let expected = [
        new EndPhaseCommand(),        
    ];
    t.assertEqualsInAnyOrder(expected, commands);
});


t.test('generate close combat commands for one unit and one target', function () {
    const game = makeGame(new NullScenario());
    const phase = new BattlePhase(game);
    game.placeUnit(hexOf(1, 1), new units.RomanHeavyInfantry());
    game.placeUnit(hexOf(2, 1), new units.CarthaginianHeavyInfantry());

    let commands = phase.validCommands(game);

    let expected = [
        new CloseCombatCommand(hexOf(2, 1), hexOf(1, 1)),
        new EndPhaseCommand(),        
    ];
    t.assertEqualsInAnyOrder(expected, commands);
});

t.test('generate close combat commands for one unit and two targets', function () {
    const game = makeGame(new NullScenario());
    const phase = new BattlePhase(game);
    game.placeUnit(hexOf(1, 1), new units.RomanHeavyInfantry());
    game.placeUnit(hexOf(2, 1), new units.CarthaginianHeavyInfantry());
    game.placeUnit(hexOf(1, 2), new units.CarthaginianHeavyInfantry());
    
    let commands = phase.validCommands(game);

    let expected = [
        new CloseCombatCommand(hexOf(2, 1), hexOf(1, 1)),
        new CloseCombatCommand(hexOf(1, 2), hexOf(1, 1)),
        new EndPhaseCommand(),        
    ];
    t.assertEqualsInAnyOrder(expected, commands);
});

