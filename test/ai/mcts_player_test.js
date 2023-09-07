import makeGame from "model/game.js";
import { AkragasScenario } from "model/scenarios.js";
import { MctsPlayer } from "ai/mcts_player.js";


test('MCTS one search expands the initial node', () => {
    const game = makeGame(new AkragasScenario());
    const player = new MctsPlayer({
        iterations: 1,
    });
    const tree = player.search(game);

    expect(tree.children.length).toBe(3);
    expect(tree.size()).toBe(4);
    expect(tree.visits).toBe(3);
    expect(tree.score).toBe(33);
});

function show(bestCommands) {
    return bestCommands.map(c => c.toString());
}

test('MCTS one search expands the initial node', () => {
    const game = makeGame(new AkragasScenario());
    const player = new MctsPlayer({
        iterations: 100,
        // expansionFactor: 1000,
    });
    const tree = player.search(game);

    console.log(tree.shape());
    console.dir(show(tree.bestCommands()));
    // console.log(tree.toString());

    // expect(tree.children.length).toBe(3);
    // expect(tree.size()).toBe(4);
    // expect(tree.visits).toBe(1);
    // expect(tree.score).toBe(11);
});

// TODO
// DONE score all available moves at expansion time
// DONE endphase not available until all units are ordered
// endphase not available until all units are moved or decided to stay
// deal with non-deterministic moves
// deal with change of side
// avoid looping moves
