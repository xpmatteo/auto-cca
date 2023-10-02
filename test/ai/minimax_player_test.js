import makeGame from "model/game.js";
import { AkragasScenario, MeleeScenario } from "model/scenarios.js";
import { MinimaxPlayer } from "ai/minimax_player.js";


test('level zero search', () => {
    const game = makeGame(new AkragasScenario());
    const player = new MinimaxPlayer(game);
    const tree = player.search(game, 0);

    // expect(tree.score).toBe(9);
    expect(tree.children.length).toBe(0);
    expect(tree.bestCommands()).toEqual([]);
    expect(tree.size()).toBe(1);
});

test('level 1 search', () => {
    const game = makeGame(new AkragasScenario());
    const player = new MinimaxPlayer(game);
    const tree = player.search(game, 1);

    // expect(tree.score).toBe(9);
    expect(tree.children.length).toBe(3);
});

// test: stop when action is not deterministic
// test: stop when acion changes current side

// level 1: playCard
// level 2: activate units
// level 3: move units
xtest('level 4 search', () => {
    const game = makeGame(new AkragasScenario());
    const player = new MinimaxPlayer(game);
    const tree = player.search(game, 8);

    // console.dir(tree, {depth: 8 });
    console.log(tree.bestCommands());
    console.log(tree.score);
    console.log(tree.size());
    console.log(tree.shape());
    // expect(tree.score).toBe(15);
    // expect(tree.children.length).toBe(3);
    // expect(tree.children[0].children.length).toBe(12);
});
