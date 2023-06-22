import { assertDeepEquals, assertEquals, test } from "../lib/test_lib.js";
import AIPlayer, { aiTree, performanceObserver, treeObserver, winLossObserver } from "./ai_player.js";
import makeGame from "../model/game.js";
import { Side } from "../model/side.js";
import { hexOf } from "../lib/hexlib.js";
import * as units from "../model/units.js";
import * as GameStatus from "../model/game_status.js";
import { Scenario } from "../model/scenarios.js";
import { RESULT_SWORDS } from "../model/dice.js";
import { MoveCommand } from "../model/commands/moveCommand.js";
import { EndPhaseCommand } from "../model/commands/endPhaseCommand.js";
import { CloseCombatCommand } from "../model/commands/closeCombatCommand.js";

// unit tests for the AIPlayer class

// decideMove
test('decideMove', () => {
    let state = {
        validCommands: () => [1, 2, 3, 4],
        currentSide: 'roman',
        isTerminal: () => false
    };
    let ai = new AIPlayer({
        iterations: 1
    });
    let root = {
        mostVisitedPathMoves: () => {
            return [2];
        }
    };
    ai.__doDecideMove = () => root;
    assertDeepEquals([2], ai.decideMove(state));
});

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

function executeAll(moves, game) {
    for (let move of moves) {
        game.executeCommand(move);
    }
}

test('Kill in one move', () => {
    let game = makeGame(smallScenario, diceAlwaysSwords);
    let ai = new AIPlayer({
        game: game,
        iterations: 2000,       // 2000 are required; if you reduce it to 1000, it does not attack
        aiWinStatuses: [GameStatus.CARTHAGINIAN_WIN],
        aiLoseStatuses: [GameStatus.ROMAN_WIN],
        aiToken: Side.CARTHAGINIAN,
    });

    let movementMoves = ai.decideMove(game);

    let expectedMovementMoves = [
        new MoveCommand(hexOf(0, 2), hexOf(1, 1)),
        new EndPhaseCommand(),
    ];
    // console.log(aiTree);
    // console.log(aiTree.shape())
    // console.log(aiTree.mostVisitedPath1(() => true).map(n => `${n.move} ${n.sideExecutingTheMove}`));
    assertDeepEquals(expectedMovementMoves, movementMoves);
    executeAll(movementMoves, game);

    let combatMoves = ai.decideMove(game);
    let expectedCombatMove = [
        new CloseCombatCommand(hexOf(0, 3), hexOf(0, 2)),
    ];
    assertDeepEquals(expectedCombatMove, combatMoves);
});