import * as t from './test_lib.js';
import * as game from './game.js';
import { hexOf } from './hexlib.js';

t.test('generate moves for one unit', function () {
    let g = new game.Game();
    t.assertEquals(game.Side.ROMAN, g.currentSide);
    g.addUnit(hexOf(1, 1), new game.RomanHeavyInfantry());
    g.addUnit(hexOf(3, 3), new game.CarthaginianHeavyInfantry());
    
    let moves = g.generateMoves();

    t.assertEquals(6, moves.length);
    let expected = [
        new game.MoveCommand(hexOf(1, 0), hexOf(1, 1)),
        new game.MoveCommand(hexOf(2, 0), hexOf(1, 1)),
        new game.MoveCommand(hexOf(0, 1), hexOf(1, 1)),
        new game.MoveCommand(hexOf(2, 1), hexOf(1, 1)),
        new game.MoveCommand(hexOf(0, 2), hexOf(1, 1)),
        new game.MoveCommand(hexOf(1, 2), hexOf(1, 1)),
    ];
    t.assertEqualsInAnyOrder(expected, moves);
});


/*
     1,4   2,4    3,4   4,4
        1,5   2,5    3,5   4,5
     0,6   1,6    2,6   3,6   
*/

t.test('generate moves for two units, avoiding collisions', function () {
    let g = new game.Game();
    t.assertEquals(game.Side.ROMAN, g.currentSide);
    g.addUnit(hexOf(2, 5), new game.RomanHeavyInfantry());
    g.addUnit(hexOf(3, 5), new game.RomanHeavyInfantry());    
    
    let moves = g.generateMoves();

    t.assertEquals(10, moves.length);
    let expected = [
        new game.MoveCommand(hexOf(2, 4), hexOf(2, 5)),
        new game.MoveCommand(hexOf(3, 4), hexOf(2, 5)),
        new game.MoveCommand(hexOf(1, 5), hexOf(2, 5)),
        new game.MoveCommand(hexOf(1, 6), hexOf(2, 5)),
        new game.MoveCommand(hexOf(2, 6), hexOf(2, 5)),

        new game.MoveCommand(hexOf(3, 4), hexOf(3, 5)),
        new game.MoveCommand(hexOf(4, 4), hexOf(3, 5)),
        new game.MoveCommand(hexOf(4, 5), hexOf(3, 5)),
        new game.MoveCommand(hexOf(2, 6), hexOf(3, 5)),
        new game.MoveCommand(hexOf(3, 6), hexOf(3, 5)),
    ];
    t.assertEqualsInAnyOrder(expected, moves);
});
