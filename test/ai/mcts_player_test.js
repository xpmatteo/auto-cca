import { MctsPlayer } from "ai/mcts_player.js";
import makeGame from "model/game.js";
import { NullScenario } from "model/scenarios.js";
import { RomanHeavyInfantry } from "model/units.js";
import { hexOf } from "xlib/hexlib.js";


test('MCTS one search expands the initial node', () => {
    const game = makeGame(new NullScenario());
    game.placeUnit(hexOf(0, 0), new RomanHeavyInfantry());
    const player = new MctsPlayer({
        iterations: 1,
    });
    const tree = player.search(game);

    expect(tree.children.length).toBe(1);
    expect(tree.children[0].score).toBe(0);
    expect(tree.score).toBe(0);
    expect(tree.visits).toBe(1);
});

describe('scoring of new nodes', () => {

});

