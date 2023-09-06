import makeGame from "model/game.js";
import { AkragasScenario, TestScenario } from "model/scenarios.js";
import { MinimaxPlayer } from "ai/minimax_player.js";


test('level zero search', () => {
    const game = makeGame(new AkragasScenario());
    const player = new MinimaxPlayer(game);
    const tree = player.search(game, 0);

    expect(tree.score).toBe(11);
    expect(tree.children.length).toBe(0);
});

test('level 1 search', () => {
    const game = makeGame(new AkragasScenario());
    const player = new MinimaxPlayer(game);
    const tree = player.search(game, 1);

    expect(tree.children.length).toBe(3);
    expect(tree.score).toBe(11);
});

test('level 2 search', () => {
    const game = makeGame(new AkragasScenario());
    const player = new MinimaxPlayer(game);
    const tree = player.search(game, 2);

    expect(tree.children.length).toBe(3);
    expect(tree.score).toBe(11);
});
