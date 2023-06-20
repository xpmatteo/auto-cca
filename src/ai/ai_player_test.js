import { assertDeepEquals, assertEquals, test } from "../lib/test_lib.js";
import AIPlayer from "./ai_player.js";

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
        mostVisited: () => {
            return {
                move: 2
            };
        }
    };
    ai.__doDecideMove = () => root;
    assertDeepEquals([2], ai.decideMove(state));
});
