import makeGame from "model/game.js";
import { AkragasScenario } from "model/scenarios.js";
import { MctsPlayer } from "ai/mcts_player.js";


test('MCTS one search expands the initial node', () => {
    const game = makeGame(new AkragasScenario());
    const player = new MctsPlayer({
        game: game,
        iterations: 1,
    });
    const tree = player.search();

    console.log(tree.shape());
    console.log(tree.toString());

    expect(tree.children.length).toBe(3);
    expect(tree.size()).toBe(4);
    expect(tree.visits).toBe(1);
    expect(tree.score).toBe(11);
});

