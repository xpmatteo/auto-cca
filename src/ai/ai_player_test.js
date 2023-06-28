import { assertDeepEquals, assertEquals, assertFalse, assertTrue, test, xtest } from "../lib/test_lib.js";
import AIPlayer, { __executeManyTimes } from "./ai_player.js";
import makeGame from "../model/game.js";
import { Side } from "../model/side.js";
import { hexOf } from "../lib/hexlib.js";
import * as units from "../model/units.js";
import GameStatus from "../model/game_status.js";
import { NullScenario, Scenario, TestScenario } from "../model/scenarios.js";
import { RESULT_SWORDS } from "../model/dice.js";
import { MoveCommand } from "../model/commands/moveCommand.js";
import { EndPhaseCommand } from "../model/commands/endPhaseCommand.js";
import { CloseCombatCommand } from "../model/commands/closeCombatCommand.js";
import { makeRootNode } from "./monte_carlo_tree_search_node.js";

// unit tests for the AIPlayer class

// decideMove
// test('decideMove', () => {
//     let state = {
//         validCommands: () => [1, 2, 3, 4],
//         currentSide: 'roman',
//         isTerminal: () => false
//     };
//     let ai = new AIPlayer({
//         iterations: 1
//     });
//     let root = {
//         mostVisitedPathMoves: () => {
//             return [2];
//         }
//     };
//     ai.__doDecideMove = () => root;
//     assertDeepEquals([2], ai.decideMove(state));
// });

class SmallScenario extends Scenario {
    firstSide = Side.CARTHAGINIAN;
    sideNorth = Side.CARTHAGINIAN;
    sideSouth = Side.ROMAN;
    pointsToWin = 1;
    maxTurns = 3;

    placeUnitsOn(board) {
        board.placeUnit(hexOf(0, 3), new units.RomanLightInfantry());
        board.placeUnit(hexOf(1, 1), new units.CarthaginianHeavyInfantry());
    }

    gameStatus(game) {
        if (game.turnCount > this.maxTurns) {
            return GameStatus.ROMAN_WIN;
        }
        if (game.killedUnitsOfSide(Side.CARTHAGINIAN).length === this.pointsToWin) {
            return GameStatus.ROMAN_WIN;
        }
        if (game.killedUnitsOfSide(Side.ROMAN).length === this.pointsToWin) {
            return GameStatus.CARTHAGINIAN_WIN;
        }
        return GameStatus.ONGOING;
    }
}

const smallScenario = new SmallScenario();
const diceAlwaysSwords = {
    roll: (diceCount) => Array(diceCount).fill(RESULT_SWORDS),
}

test('pushChild deterministic', () => {
    let game = makeGame(new NullScenario(), diceAlwaysSwords);
    let ai = new AIPlayer({
        game: game,
        iterations: 2000,
        aiWinStatuses: [GameStatus.CARTHAGINIAN_WIN],
        aiLoseStatuses: [GameStatus.ROMAN_WIN],
        aiToken: Side.CARTHAGINIAN,
    });
    game.placeUnit(hexOf(1, 2), new units.CarthaginianHeavyInfantry());

    let root = makeRootNode(game, Side.CARTHAGINIAN);
    ai.pushChild(game, new MoveCommand(hexOf(0, 2), hexOf(1, 2)), root);

    assertEquals(1, root.children.length);
    let child = root.children[0];
    assertTrue(child.state.unitAt(hexOf(0, 2)), "move was executed");
});


test('pushChild chance', () => {
    let game = makeGame(new NullScenario());
    let ai = new AIPlayer({
        game: game,
        iterations: 2000,
        aiWinStatuses: [GameStatus.CARTHAGINIAN_WIN],
        aiLoseStatuses: [GameStatus.ROMAN_WIN],
        aiToken: Side.CARTHAGINIAN,
    });
    // place unit close to enemy
    game.placeUnit(hexOf(0, 1), new units.RomanLightInfantry());
    game.placeUnit(hexOf(1, 1), new units.CarthaginianHeavyInfantry());

    let command = new CloseCombatCommand(hexOf(0, 1), hexOf(1, 1));
    let clone = __executeManyTimes(game, command);

});

