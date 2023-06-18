import { assertEquals, assertTrue, assertDeepEquals, test } from "./test_lib.js";
import AIPlayer, { MonteCarloTreeSearchNode } from "./mcts_ai.js";
import * as ttt from "./tic_tac_toe.js";

const initialState = {
    board: [ttt.CELL_X,     ttt.CELL_EMPTY, ttt.CELL_EMPTY,
            ttt.CELL_EMPTY, ttt.CELL_EMPTY, ttt.CELL_EMPTY,
            ttt.CELL_EMPTY, ttt.CELL_EMPTY, ttt.CELL_EMPTY],
    nextPlayer: ttt.CELL_O,
    gameStatus: ttt.GAME_ONGOING
};


test('ucb1', () => {
    let root = new MonteCarloTreeSearchNode(null, null, null, null);
    let node = new MonteCarloTreeSearchNode(null, null, root, null);

    assertEquals(Infinity, node.ubc1()); 
    assertTrue(1 < Infinity, "infinity!");
});

// test('expand initial state', () => {
//     let game = new ttt.TicTacToe(3);
//     let aiPlayer = new AIPlayer(game, ttt.GAME_O_VICTORY, 1);

//     assertEquals(8, game.validMoves(initialState).length);

//     aiPlayer.decideMove(initialState);

//     assertEquals(9, aiPlayer.root.size());
//     assertEquals(2, aiPlayer.root.depth());
// });
