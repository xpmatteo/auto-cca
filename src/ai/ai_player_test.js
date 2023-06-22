import { assertDeepEquals, assertEquals, test } from "../lib/test_lib.js";
import AIPlayer from "./ai_player.js";
import makeGame from "../model/game.js";
import { Side } from "../model/side.js";
import { hexOf } from "../lib/hexlib.js";
import * as units from "../model/units.js";
import * as GameStatus from "../model/game_status.js";
import { Scenario } from "../model/scenarios.js";
import { RESULT_SWORDS } from "../model/dice.js";

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
        mostVisitedPath: () => {
            return [2];
        }
    };
    ai.__doDecideMove = () => root;
    assertDeepEquals([2], ai.decideMove(state));
});

class SmallScenario extends Scenario {
    firstSide = Side.ROMAN;
    sideNorth = Side.CARTHAGINIAN;
    sideSouth = Side.ROMAN;
    pointsToWin = 1;
    maxTurns = 2;

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

test('Kill in one move', () => {
    let game = makeGame(smallScenario, diceAlwaysSwords);
});